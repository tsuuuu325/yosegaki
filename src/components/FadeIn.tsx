"use client";

export default function FadeIn({
  children,
  delay = 0,
  className = "",
  variant = "fade-in-up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?:
    | "fade-in-up"
    | "letter-arrive"
    | "team-pop"
    | "birthday-drop"
    | "ink-slide"
    | "neon-flicker"
    | "botanical-bloom";
}) {
  return (
    <div
      className={`animate-${variant} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
