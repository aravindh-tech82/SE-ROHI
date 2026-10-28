import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'default', showText = true, to = '/' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const iconSize = isLarge ? 'w-10 h-10' : isSmall ? 'w-7 h-7' : 'w-8 h-8';
  const textSize = isLarge ? 'text-2xl' : isSmall ? 'text-lg' : 'text-xl';

  const content = (
    <div className="flex items-center gap-2.5 group select-none">
      <div className={`relative ${iconSize} flex items-center justify-center rounded-xl bg-gradient-to-br from-[#9303C5] to-[#581C87] p-0.5 shadow-lg shadow-royal-900/50 group-hover:shadow-royal-600/40 transition-all duration-300`}>
        <div className="w-full h-full bg-[#070D19] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle violet sheen in logo */}
          <div className="absolute inset-0 bg-gradient-to-tr from-royal-600/20 via-transparent to-white/10" />
          
          {/* Geometric academic emblem */}
          <svg
            className="w-4/6 h-4/6 text-royal-400 group-hover:text-royal-300 transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Modern Graduation Cap Diamond & Geometric Base */}
            <polygon points="12 2 22 8.5 12 15 2 8.5 12 2" />
            <path d="M6 11.5v5.5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5.5" />
            <path d="M22 8.5v6" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex items-baseline">
          <span className={`font-bold tracking-tight text-white ${textSize}`}>
            STUDENT
          </span>
          <span className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-royal-400 to-[#C084FC] ${textSize}`}>
            X
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return <Link to={to} className="inline-block">{content}</Link>;
  }

  return content;
}

