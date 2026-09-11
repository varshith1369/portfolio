import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Send, CheckCircle, ArrowRight, Github } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { HeroContent, HeroItem, FadeUp } from "@/components/ui/scroll-animation";
import type { PricingState } from "@/components/PricingPlans";

interface LocationState {
  pricing?: PricingState;
}

const Contact = () => {
  const { toast } = useToast();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const pricingData = locationState?.pricing;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120,120,255,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (pricingData) {
      const billingLabel = pricingData.billingType === "annual" ? "Annual" : "Monthly";
      setFormData((prev) => ({
        ...prev,
        subject: `${pricingData.planName} Plan Inquiry`,
        message: `I'm interested in the ${pricingData.planName} plan.\n\nSelected options:\n• Billing: ${billingLabel}\n• Team size: ${pricingData.teamSize} member${pricingData.teamSize > 1 ? "s" : ""}\n• Price: $${pricingData.price.toFixed(0)}/month\n\nPlease send me more information.`,
      }));
    }
  }, [pricingData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/yannabathulavarshithreddy7@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim(),
            message: formData.message.trim(),
            _honey: formData.website,
            _captcha: "false",
          }),
        }
      );

      setIsSubmitting(false);

      const result = await res.json().catch(() => ({}));
      console.log("Formsubmit response:", res.status, result);

      if (result.success === "true" || result.success === true) {
        setIsSubmitted(true);
        toast({ title: "Message sent! ✉️", description: "I'll get back to you as soon as possible." });
      } else {
        const msg: string = typeof result.message === "string" ? result.message : "";
        if (msg.toLowerCase().includes("activat") || msg.toLowerCase().includes("confirm")) {
          toast({
            title: "One-time activation needed 📬",
            description: "Formsubmit sent an activation email to yannabathulavarshithreddy7@gmail.com — click the link there, then submit again.",
          });
        } else {
          throw new Error(msg || "Submission failed");
        }
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setIsSubmitting(false);
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "yannabathulavarshithreddy7@gmail.com", href: "mailto:yannabathulavarshithreddy7@gmail.com", color: "from-blue-500/20 to-indigo-500/20" },
    { icon: Phone, label: "WhatsApp", value: "+91 91772 75881", href: "https://wa.me/919177275881", color: "from-green-500/20 to-emerald-500/20" },
    { icon: MapPin, label: "Location", value: "Phagwara, Punjab, India", href: null, color: "from-orange-500/20 to-amber-500/20" },
  ];

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com/varshithreddy", color: "hover:bg-zinc-800 hover:text-white" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/varshith-reddy", color: "hover:bg-blue-600 hover:text-white" },
    { icon: Twitter, label: "X / Twitter", href: "https://x.com", color: "hover:bg-black hover:text-white" },
  ];

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />

        {/* Animated grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/10 blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-violet-500/10 blur-[60px] animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="container relative z-10 text-center py-24 md:py-32">
          <HeroContent className="flex flex-col items-center">
            <HeroItem>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background/60 backdrop-blur-sm text-sm text-muted-foreground mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Available for opportunities
              </div>
            </HeroItem>
            <HeroItem>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
                Let's Build
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                  Something Great
                </span>
              </h1>
            </HeroItem>
            <HeroItem>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Have a project in mind or want to collaborate? I'd love to hear from you — drop a message and I'll respond promptly.
              </p>
            </HeroItem>
            <HeroItem>
              <a
                href="#contact-form"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Send a message <ArrowRight className="w-4 h-4" />
              </a>
            </HeroItem>
          </HeroContent>
        </div>
      </section>

      {/* ── Main Contact Section ── */}
      <section id="contact-form" className="py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

            {/* LEFT: Form (3 cols) */}
            <FadeUp className="lg:col-span-3">
              <div className="relative rounded-3xl border border-border/50 bg-background/60 backdrop-blur-md p-8 md:p-10 shadow-2xl overflow-hidden">
                {/* Glow accent */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

                <div className="mb-8">
                  <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">Contact Form</p>
                  <h2 className="text-3xl font-bold tracking-tight">Send a Message</h2>
                </div>

                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center mb-6 ring-1 ring-green-400/30">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Message Sent! 🎉</h3>
                    <p className="text-muted-foreground max-w-sm leading-relaxed">
                      Thank you for reaching out, Varshith will get back to you within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-8 rounded-full"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: "", email: "", subject: "", message: "", website: "" });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                    {/* Honeypot */}
                    <div className="absolute -left-[9999px]" aria-hidden="true">
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                          Name <span className="text-indigo-400">*</span>
                        </label>
                        <div className={`relative transition-all duration-300 ${focusedField === "name" ? "scale-[1.01]" : ""}`}>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Varshith Reddy"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            maxLength={200}
                            className={`rounded-xl h-12 bg-secondary/40 border-border/50 transition-all duration-300 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 ${errors.name ? "border-destructive" : ""}`}
                          />
                        </div>
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                          Email <span className="text-indigo-400">*</span>
                        </label>
                        <div className={`relative transition-all duration-300 ${focusedField === "email" ? "scale-[1.01]" : ""}`}>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            maxLength={254}
                            className={`rounded-xl h-12 bg-secondary/40 border-border/50 transition-all duration-300 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 ${errors.email ? "border-destructive" : ""}`}
                          />
                        </div>
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium flex items-center gap-1">
                        Subject <span className="text-indigo-400">*</span>
                      </label>
                      <div className={`relative transition-all duration-300 ${focusedField === "subject" ? "scale-[1.005]" : ""}`}>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Collaboration, Internship, Project..."
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("subject")}
                          onBlur={() => setFocusedField(null)}
                          maxLength={500}
                          className={`rounded-xl h-12 bg-secondary/40 border-border/50 transition-all duration-300 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 ${errors.subject ? "border-destructive" : ""}`}
                        />
                      </div>
                      {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium flex items-center gap-1">
                        Message <span className="text-indigo-400">*</span>
                      </label>
                      <div className={`relative transition-all duration-300 ${focusedField === "message" ? "scale-[1.005]" : ""}`}>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell me about what you have in mind..."
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("message")}
                          onBlur={() => setFocusedField(null)}
                          maxLength={10000}
                          className={`rounded-xl resize-none bg-secondary/40 border-border/50 transition-all duration-300 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20 ${errors.message ? "border-destructive" : ""}`}
                        />
                      </div>
                      {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full overflow-hidden rounded-2xl px-8 py-4 text-base font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.08) inset, 0 8px 32px rgba(99,102,241,0.25), 0 2px 8px rgba(0,0,0,0.4)",
                        color: "#fff",
                      }}
                    >
                      {/* Shimmer sweep */}
                      <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      {/* Top gloss line */}
                      <span className="pointer-events-none absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          <span className="tracking-wide">Sending…</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-3">
                          <span className="tracking-wide">Send Message</span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                            <Send className="w-3.5 h-3.5" />
                          </span>
                        </span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </FadeUp>

            {/* RIGHT: Info cards (2 cols) */}
            <FadeUp delay={0.15} className="lg:col-span-2 flex flex-col gap-6">

              {/* Contact cards */}
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">Contact Details</p>
                <div className="flex flex-col gap-3">
                  {contactInfo.map((item) => (
                    <div
                      key={item.label}
                      className="group relative flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-background/60 backdrop-blur-sm hover:border-border transition-all duration-300 hover:shadow-md overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <div className="relative w-11 h-11 rounded-xl bg-secondary/80 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="relative min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium truncate block hover:text-indigo-400 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium truncate">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social links */}
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-4">Find Me Online</p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-background/60 text-sm font-medium text-muted-foreground transition-all duration-300 ${item.color} hover:border-transparent hover:scale-[1.03]`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Response time card */}
              <div className="relative rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5 p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-400/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground">Response Time</p>
                  </div>
                  <p className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                    &lt; 24h
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    I respond to all messages within one business day.
                  </p>
                </div>
              </div>

              {/* Availability note */}
              <div className="rounded-2xl border border-border/50 bg-secondary/20 p-5 text-sm text-muted-foreground leading-relaxed">
                🎓 Currently a <span className="text-foreground font-medium">3rd-year B.Tech CSE student</span> at LPU, open to internships, freelance work, and collaborative projects in <span className="text-foreground font-medium">ML, data analytics</span>, and <span className="text-foreground font-medium">full-stack development</span>.
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
