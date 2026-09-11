import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: max 3 submissions per IP per hour
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();
// Additional rate limiting: max 2 submissions per email per hour
const emailRateLimitMap = new Map<string, { count: number; resetTime: number }>();

const MAX_IP_REQUESTS = 3;
const MAX_EMAIL_REQUESTS = 2;
const TIME_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkIpRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipRateLimitMap.get(ip);
  
  if (!entry || now > entry.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + TIME_WINDOW_MS });
    return { allowed: true, remaining: MAX_IP_REQUESTS - 1 };
  }
  
  if (entry.count >= MAX_IP_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  
  entry.count++;
  return { allowed: true, remaining: MAX_IP_REQUESTS - entry.count };
}

function checkEmailRateLimit(email: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const normalizedEmail = email.toLowerCase().trim();
  const entry = emailRateLimitMap.get(normalizedEmail);
  
  if (!entry || now > entry.resetTime) {
    emailRateLimitMap.set(normalizedEmail, { count: 1, resetTime: now + TIME_WINDOW_MS });
    return { allowed: true, remaining: MAX_EMAIL_REQUESTS - 1 };
  }
  
  if (entry.count >= MAX_EMAIL_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  
  entry.count++;
  return { allowed: true, remaining: MAX_EMAIL_REQUESTS - entry.count };
}

// Clean up old entries periodically
function cleanupRateLimitMaps() {
  const now = Date.now();
  for (const [ip, entry] of ipRateLimitMap.entries()) {
    if (now > entry.resetTime) {
      ipRateLimitMap.delete(ip);
    }
  }
  for (const [email, entry] of emailRateLimitMap.entries()) {
    if (now > entry.resetTime) {
      emailRateLimitMap.delete(email);
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    console.log(`Contact form submission from IP: ${clientIP}`);
    
    // Check IP rate limit
    const ipRateLimit = checkIpRateLimit(clientIP);
    if (!ipRateLimit.allowed) {
      console.log(`IP rate limit exceeded for: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '3600'
          } 
        }
      );
    }
    
    // Periodic cleanup
    if (Math.random() < 0.1) {
      cleanupRateLimitMaps();
    }

    const body = await req.json();
    const { name, email, subject, message, website } = body;

    // Honeypot check - if the hidden "website" field is filled, it's a bot
    if (website && website.trim() !== '') {
      console.log(`Bot detected via honeypot from IP: ${clientIP}`);
      // Return success to not reveal detection, but don't store
      return new Response(
        JSON.stringify({ success: true, remaining: ipRateLimit.remaining }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Server-side validation
    const errors: Record<string, string> = {};
    
    // Name validation
    const trimmedName = name?.trim();
    if (!trimmedName) {
      errors.name = 'Name is required';
    } else if (trimmedName.length > 200) {
      errors.name = 'Name must be less than 200 characters';
    }
    
    // Email validation
    const trimmedEmail = email?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    } else if (trimmedEmail.length > 254) {
      errors.email = 'Email must be less than 254 characters';
    }
    
    // Subject validation
    const trimmedSubject = subject?.trim();
    if (!trimmedSubject) {
      errors.subject = 'Subject is required';
    } else if (trimmedSubject.length > 500) {
      errors.subject = 'Subject must be less than 500 characters';
    }
    
    // Message validation
    const trimmedMessage = message?.trim();
    if (!trimmedMessage) {
      errors.message = 'Message is required';
    } else if (trimmedMessage.length > 10000) {
      errors.message = 'Message must be less than 10,000 characters';
    }
    
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      return new Response(
        JSON.stringify({ error: 'Validation failed', errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check email rate limit (after validation to ensure valid email)
    const emailRateLimit = checkEmailRateLimit(trimmedEmail);
    if (!emailRateLimit.allowed) {
      console.log(`Email rate limit exceeded for: ${trimmedEmail}`);
      return new Response(
        JSON.stringify({ error: 'Too many submissions from this email. Please try again later.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '3600'
          } 
        }
      );
    }

    // Create Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert the contact submission
    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit message. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Contact form submitted successfully');
    return new Response(
      JSON.stringify({ success: true, remaining: Math.min(ipRateLimit.remaining, emailRateLimit.remaining) }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing contact submission:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
