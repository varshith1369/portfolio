import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { cn } from '@/lib/utils';

// ✏️ HERO HEADING TEXT - EASY TO EDIT
// Just change this text to update the heading
const HERO_HEADING_LINE_1 = "Accelerate business growth";
const HERO_HEADING_LINE_2 = "with strategic advertising.";
interface TypingHeadingProps {
  className?: string;
}
export function TypingHeading({
  className
}: TypingHeadingProps) {
  const fullText = `${HERO_HEADING_LINE_1} ${HERO_HEADING_LINE_2}`;
  const {
    displayedText,
    showCursor,
    isComplete
  } = useTypingAnimation({
    text: fullText,
    typingSpeed: 55,
    pauseAfterTyping: 500,
    startDelay: 400
  });

  // Find where to split for the second line
  const line1Length = HERO_HEADING_LINE_1.length;
  const displayedLine1 = displayedText.slice(0, line1Length);
  const displayedLine2 = displayedText.slice(line1Length + 1); // +1 for the space

  return <h1 className={cn("text-5xl md:text-7xl tracking-tight text-white leading-[0.95] lg:text-6xl font-light", className)} aria-label={fullText}>
      <span className="inline text-4xl">
        {displayedLine1}
        {/* Show cursor on line 1 if still typing line 1 */}
        {showCursor && displayedText.length <= line1Length && <span className={cn("inline-block w-[3px] h-[0.9em] bg-white ml-1 align-middle", !isComplete && "animate-pulse")} aria-hidden="true" />}
      </span>
      <span className="block mt-2 text-4xl">
        {displayedLine2}
        {/* Show cursor on line 2 if typing line 2 */}
        {showCursor && displayedText.length > line1Length && <span className={cn("inline-block w-[3px] h-[0.9em] bg-white ml-1 align-middle", !isComplete && "animate-pulse")} aria-hidden="true" />}
      </span>
      {/* Hidden text for screen readers */}
      <span className="sr-only">{fullText}</span>
    </h1>;
}