'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import QuickContactModal from './quick-contact-modal';

interface ContactButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  text?: string;
  useModal?: boolean; // New prop to use modal instead of navigation
}

export default function ContactButton({
  variant = 'primary',
  size = 'md',
  className = '',
  showIcon = true,
  text = 'تواصل معنا',
  useModal = false
}: ContactButtonProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-gray-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    text: 'text-gray-700 hover:text-black hover:underline focus:ring-gray-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonContent = (
    <>
      {showIcon && (
        <MessageSquare className={`${iconSizes[size]} ml-2`} />
      )}
      {text}
    </>
  );

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (useModal) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={buttonClasses}
        >
          {buttonContent}
        </button>
        <QuickContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <Link
      href="/contact"
      className={buttonClasses}
    >
      {buttonContent}
    </Link>
  );
}
