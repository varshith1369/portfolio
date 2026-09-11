import { useState, useEffect, useRef } from 'react';

interface UseTypingAnimationOptions {
  text: string;
  typingSpeed?: number; // ms per character (40-70)
  pauseAfterTyping?: number; // ms to wait after typing completes
  startDelay?: number; // ms to wait before starting
}

interface UseTypingAnimationReturn {
  displayedText: string;
  isTyping: boolean;
  isComplete: boolean;
  showCursor: boolean;
}

export function useTypingAnimation({
  text,
  typingSpeed = 55,
  pauseAfterTyping = 500,
  startDelay = 300,
}: UseTypingAnimationOptions): UseTypingAnimationReturn {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Only run once
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show full text immediately without animation
      setDisplayedText(text);
      setIsComplete(true);
      setShowCursor(false);
      return;
    }

    let currentIndex = 0;
    let typingTimeout: ReturnType<typeof setTimeout>;
    let cursorTimeout: ReturnType<typeof setInterval>;

    // Start delay
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          
          // Random speed variation for natural feel (40-70ms range)
          const variance = Math.random() * 30 - 15;
          const nextDelay = Math.max(40, Math.min(70, typingSpeed + variance));
          
          typingTimeout = setTimeout(typeNextChar, nextDelay);
        } else {
          setIsTyping(false);
          setIsComplete(true);
          
          // Hide cursor after pause
          cursorTimeout = setTimeout(() => {
            setShowCursor(false);
          }, pauseAfterTyping);
        }
      };

      typeNextChar();
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(typingTimeout);
      clearTimeout(cursorTimeout);
    };
  }, [text, typingSpeed, pauseAfterTyping, startDelay]);

  return { displayedText, isTyping, isComplete, showCursor };
}
