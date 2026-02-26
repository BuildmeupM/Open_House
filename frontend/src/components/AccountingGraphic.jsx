import React from 'react';

export default function AccountingGraphic() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="gradOrange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="gradLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="100%" stopColor="#FFEDD5" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#EA580C" floodOpacity="0.15" />
        </filter>
        <style>
          {`
            .float-anim { animation: float 4s ease-in-out infinite; }
            .float-anim-2 { animation: float 5s ease-in-out infinite reverse; }
            .float-anim-3 { animation: float 6s ease-in-out infinite; }
            .pulse-line { animation: dashPulse 2s linear infinite; stroke-dasharray: 6 6; }
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
            @keyframes dashPulse {
              to { stroke-dashoffset: -12; }
            }
          `}
        </style>
      </defs>

      {/* Background abstract shapes */}
      <path d="M 0 160 Q 150 120 250 160 T 500 150 L 500 200 L 0 200 Z" fill="url(#gradLight)" />
      
      {/* Central Cloud / Server Platform */}
      <rect x="150" y="140" width="200" height="15" rx="7.5" fill="url(#gradOrange)" filter="url(#shadow)" />
      
      {/* Nodes and Dash Lines (Digital Network) */}
      <path d="M 80 100 Q 150 140 250 140" fill="none" stroke="#F97316" strokeWidth="2" className="pulse-line" />
      <path d="M 420 100 Q 350 140 250 140" fill="none" stroke="#F97316" strokeWidth="2" className="pulse-line" />
      <path d="M 250 60 L 250 140" fill="none" stroke="#F97316" strokeWidth="2" className="pulse-line" />
      
      <circle cx="80" cy="100" r="6" fill="#EA580C" />
      <circle cx="420" cy="100" r="6" fill="#EA580C" />
      <circle cx="250" cy="60" r="8" fill="#F97316" />


      {/* Floating sparkles */}
      <circle cx="150" cy="50" r="3" fill="#FDBA74" className="float-anim-2" />
      <circle cx="350" cy="30" r="4" fill="#F97316" className="float-anim" />
      <circle cx="200" cy="110" r="2.5" fill="#EA580C" className="float-anim-3" />
      <circle cx="300" cy="90" r="3.5" fill="#FDBA74" className="float-anim-2" />
    </svg>
  );
}
