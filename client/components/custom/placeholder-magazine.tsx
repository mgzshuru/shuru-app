import React from 'react';

interface PlaceholderMagazineProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function PlaceholderMagazine({
  width = 300,
  height = 400,
  className = ""
}: PlaceholderMagazineProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 400"
      className={`bg-gray-200 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="300" height="400" fill="#f3f4f6" />
      <rect x="20" y="40" width="260" height="80" fill="#e5e7eb" rx="4" />
      <rect x="20" y="140" width="180" height="20" fill="#d1d5db" rx="2" />
      <rect x="20" y="170" width="220" height="16" fill="#d1d5db" rx="2" />
      <rect x="20" y="194" width="160" height="16" fill="#d1d5db" rx="2" />
      <rect x="20" y="240" width="260" height="120" fill="#e5e7eb" rx="4" />
      <circle cx="150" cy="200" r="30" fill="#9ca3af" opacity="0.5" />
      <text
        x="150"
        y="205"
        textAnchor="middle"
        className="fill-gray-500 text-sm font-['IBM_Plex_Sans_Arabic']"
      >
        مجلة شروع
      </text>
    </svg>
  );
}
