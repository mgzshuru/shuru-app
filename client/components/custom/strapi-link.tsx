import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StrapiLinkProps {
  href: string;
  isExternal?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export function StrapiLink({
  href,
  isExternal = false,
  className,
  children,
  ...props
}: StrapiLinkProps) {
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(className)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(className)} {...props}>
      {children}
    </Link>
  );
} 