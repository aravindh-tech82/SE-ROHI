import React from 'react';

export default function GlassCard({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-xl backdrop-blur-xl
        bg-[#070D19]/60
        border border-royal-600/15
        shadow-lg shadow-black/40
        transition-all duration-300
        ${hoverEffect ? 'hover:border-royal-500/35 hover:bg-[#070D19]/80 hover:shadow-royal-950/40 hover:-translate-y-0.5' : ''}
        ${glow ? 'shadow-[0_0_25px_-5px_rgba(147,3,197,0.25)]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

