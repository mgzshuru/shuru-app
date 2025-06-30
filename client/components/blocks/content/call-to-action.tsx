import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CallToActionProps {
  title: string;
  description?: string;
  button_text: string;
  button_url: string;
  style?: 'primary' | 'secondary' | 'outline';
  background_color?: string;
  open_in_new_tab?: boolean;
}

export function CallToAction({
  title,
  description,
  button_text,
  button_url,
  style = 'primary',
  background_color,
  open_in_new_tab = false
}: CallToActionProps) {
  const buttonStyles = {
    primary: 'bg-black text-white hover:bg-gray-800 border-black',
    secondary: 'bg-gray-100 text-black hover:bg-gray-200 border-gray-300',
    outline: 'bg-transparent text-black hover:bg-black hover:text-white border-black'
  };

  return (
    <section 
      className="py-16 px-6"
      style={background_color ? { backgroundColor: background_color } : undefined}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
          {title}
        </h2>
        
        {description && (
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
        
        <Link
          href={button_url}
          target={open_in_new_tab ? '_blank' : undefined}
          rel={open_in_new_tab ? 'noopener noreferrer' : undefined}
          className={cn(
            'inline-flex items-center px-8 py-3 text-sm font-semibold rounded-none border-2 transition-all duration-200 uppercase tracking-wider',
            buttonStyles[style]
          )}
        >
          {button_text}
        </Link>
      </div>
    </section>
  );
}