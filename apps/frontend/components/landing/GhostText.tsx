export function GhostText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none select-none font-display uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(245,245,247,0.07)] ${className}`}
    >
      {text}
    </span>
  );
}
