import React from "react";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark" | "gold";
  showSymbolOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function DeNouraLogo({ 
  className = "", 
  variant = "dark", 
  showSymbolOnly = false,
  size = "md" 
}: LogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-14 h-14"
  };

  const textSizes = {
    sm: "text-base tracking-[0.15em]",
    md: "text-xl tracking-[0.2em]",
    lg: "text-2xl tracking-[0.25em]",
    xl: "text-3xl tracking-[0.3em]"
  };

  const textColor = variant === "light" ? "text-white" : variant === "gold" ? "text-[#C5A059]" : "text-gray-900";

  return (
    <div className={`flex items-center gap-3 font-serif select-none ${className}`}>
      {/* DE'NOURA Four-Petal Geometric Emblem */}
      <svg 
        viewBox="0 0 100 100" 
        className={`${iconSizes[size]} text-[#C5A059] fill-none stroke-current stroke-[2.5]`}
      >
        {/* Top Petal */}
        <path d="M50,10 C40,25 40,40 50,48 C60,40 60,25 50,10 Z" />
        <path d="M50,18 C45,28 45,38 50,42 C55,38 55,28 50,18 Z" />
        
        {/* Right Petal */}
        <path d="M90,50 C75,40 60,40 52,50 C60,60 75,60 90,50 Z" />
        <path d="M82,50 C72,45 62,45 58,50 C62,55 72,55 82,50 Z" />
        
        {/* Bottom Petal */}
        <path d="M50,90 C40,75 40,60 50,52 C60,60 60,75 50,90 Z" />
        <path d="M50,82 C45,72 45,62 50,58 C55,62 55,72 50,82 Z" />
        
        {/* Left Petal */}
        <path d="M10,50 C25,40 40,40 48,50 C40,60 25,60 10,50 Z" />
        <path d="M18,50 C28,45 38,45 42,50 C38,55 28,55 18,50 Z" />
        
        {/* Center Diamond */}
        <polygon points="50,44 56,50 50,56 44,50" className="fill-[#C5A059]/20" />
      </svg>

      {!showSymbolOnly && (
        <span className={`font-serif font-bold uppercase ${textSizes[size]} ${textColor}`}>
          DE&apos;NOURA
        </span>
      )}
    </div>
  );
}
