import React from 'react';
import { Guest } from '@/lib/types';

interface GuestDisplayProps {
  guests: Guest[];
}

export function GuestDisplay({ guests }: GuestDisplayProps) {
  if (!guests || guests.length === 0) {
    return null;
  }

  return (
    <div className="flex items-start">
      <svg className="w-5 h-5 ml-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <div>
        <div className="font-bold mb-2">الضيوف:</div>
        <div className="flex flex-wrap gap-2">
          {guests.map((guest, index) => (
            <div
              key={index}
              className="px-3 py-2 bg-gray-100 text-gray-800 border border-gray-200"
            >
              <div className="font-medium">{guest.name}</div>
              {guest.title && (
                <div className="text-sm text-gray-600 mt-0.5">{guest.title}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
