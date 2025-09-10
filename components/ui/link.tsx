// components/CustomLink.js
import Link from 'next/link';
import { cva } from 'class-variance-authority';

const linkVariants = cva('transition-colors', {
  variants: {
    variant: {
      primary: 'hover:font-bold transition-transform',
      secondary: 'text-gray-600 hover:text-black underline',
      button:
        'px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90',
      inMenu:
        'px-3 py-2  hover:bg-primary hover:text-primary-foreground rounded-md hover:rounded-md transition-colors text-left w-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

import { ReactNode, AnchorHTMLAttributes } from 'react';

interface CustomLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'button' | 'inMenu';
  className?: string;
  isActive?: boolean;
}

const CustomLink = ({
  href,
  children,
  variant,
  className,
  isActive,
  ...props
}: CustomLinkProps) => {
  return (
    <Link
      href={href}
      className={
        (isActive ? 'border-b-2 border-primary ' : '') +
        linkVariants({ variant, className }) +
        ' w-fit py-2'
      }
      {...props}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
