import React from 'react';
import * as LucideIcons from 'lucide-react';

// Type for Lucide icon names
export type LucideIconName = keyof typeof LucideIcons;

// Props for the dynamic icon component
interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Utility function to render a Lucide React icon from its string name
 * @param name - The name of the Lucide icon (e.g., 'Mail', 'User', 'CheckCircle')
 * @param size - Size of the icon in pixels (default: 16)
 * @param className - CSS classes to apply to the icon
 * @param color - Color of the icon
 * @returns JSX element or null if icon not found
 */
export const renderLucideIcon = (
  name: string,
  size: number = 16,
  className?: string,
  color?: string
): React.ReactElement | null => {
  // Convert name to proper case if needed (e.g., 'mail' -> 'Mail')
  const iconName = name.charAt(0).toUpperCase() + name.slice(1);

  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as any)[iconName];

  if (!IconComponent) {
    console.warn(`Lucide icon "${iconName}" not found`);
    return null;
  }

  return React.createElement(IconComponent, {
    size,
    className,
    color,
  });
};

/**
 * React component for dynamic Lucide icons
 */
export const DynamicLucideIcon: React.FC<DynamicIconProps> = ({
  name,
  size = 16,
  className,
  color,
}) => {
  return renderLucideIcon(name, size, className, color);
};

/**
 * Check if a Lucide icon exists
 * @param name - The name of the icon to check
 * @returns boolean indicating if the icon exists
 */
export const isValidLucideIcon = (name: string): boolean => {
  const iconName = name.charAt(0).toUpperCase() + name.slice(1);
  return !!(LucideIcons as any)[iconName];
};

/**
 * Get all available Lucide icon names
 * @returns Array of all available icon names
 */
export const getAvailableLucideIcons = (): string[] => {
  return Object.keys(LucideIcons).filter(key =>
    typeof (LucideIcons as any)[key] === 'function'
  );
};

/**
 * Common icon mappings for easier usage
 */
export const ICON_MAPPINGS = {
  // Common icons
  email: 'Mail',
  mail: 'Mail',
  user: 'User',
  person: 'User',
  check: 'Check',
  checkCircle: 'CheckCircle',
  success: 'CheckCircle',
  trending: 'TrendingUp',
  growth: 'TrendingUp',

  // Newsletter/subscription related
  newsletter: 'Mail',
  exclusive: 'Star',
  weekly: 'Calendar',
  content: 'FileText',
  feature: 'Zap',

  // Social media
  facebook: 'Facebook',
  twitter: 'Twitter',
  instagram: 'Instagram',
  linkedin: 'Linkedin',
  youtube: 'Youtube',
} as const;

/**
 * Get icon name from common mappings or return original name
 * @param name - Original icon name or mapping key
 * @returns Proper Lucide icon name
 */
export const getIconName = (name: string): string => {
  const lowerName = name.toLowerCase();
  return ICON_MAPPINGS[lowerName as keyof typeof ICON_MAPPINGS] || name;
};
