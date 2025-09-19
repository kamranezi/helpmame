'use client';

import Link from 'next/link';
import React from 'react';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'red' | 'teal' | 'pink';
}

export default function Button({ href, children, variant = 'default' }: ButtonProps) {
  const base = "px-6 py-2 rounded-lg font-semibold text-white transition-colors focus:outline-none focus:ring";

  let variantClasses;
  switch (variant) {
    case 'red':
      variantClasses = 'bg-red-600 hover:bg-red-700 focus:ring-red-300';
      break;
    case 'teal':
      variantClasses = 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-200';
      break;
    case 'pink':
    default:
      variantClasses = 'bg-pink-500 hover:bg-pink-600 focus:ring-pink-200';
      break;
  }

  const style = `${base} ${variantClasses}`;

  return <Link href={href} className={style}>{children}</Link>;
}
