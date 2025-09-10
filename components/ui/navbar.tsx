'use client';
import { useEffect, useRef, useState } from 'react';
import CustomLink from './link';
import { usePathname } from 'next/navigation';
import { CloseIcon, MenuIcon } from './icons';
import { Button } from './button';
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const pathname = usePathname();

  // Navigation items array
  const navItems = [
    { name: 'Clients', href: '/customers' },
    { name: 'Partners', href: '/partners' },
    { name: 'Consultants', href: '/consultants' },
    { name: 'Assignments', href: '/assignments' },
  ];

  return (
    <div className="w-full">
      <nav className="max-w-screen px-4 py-4 mx-auto lg:px-8 z-[1000]">
        <div className="flex items-center justify-start mx-auto">
          <CustomLink
            href="/"
            className="cursor-pointer text-primary font-bold text-2xl mr-5"
          >
            UNQ
          </CustomLink>

          <div className="md:hidden">
            <Button onClick={toggleMobileMenu} variant={'icon'}>
              <MenuIcon />
            </Button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed top-0 left-0 w-64 transform transition-transform bg-primary-foreground duration-300 ease-in-out text-primary h-full ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:hidden z-[150]`}
            ref={mobileMenuRef}
          >
            <div className="flex items-center justify-between border-b px-4 py-4">
              <CustomLink
                href="/"
                className="mr-4 block cursor-pointer font-bold text-2xl mr-5"
              >
                UNQ
              </CustomLink>
              <Button
                onClick={toggleMobileMenu}
                variant={'icon'}
                className="hover:bg-primary-foreground"
              >
                <CloseIcon />
              </Button>
            </div>
            <ul className="flex flex-col h-full p-4">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-1 text-lg gap-x-2"
                >
                  <CustomLink
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    isActive={pathname === item.href}
                    href={item.href}
                    className={
                      'flex items-center mb-0' +
                      (pathname === item.href
                        ? ' border-primary rounded-b-none'
                        : '')
                    }
                    variant="inMenu"
                  >
                    {item.name}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <ul className="flex flex-col gap-2 md:flex-row items-center gap-6">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-1 text-lg gap-x-2"
                >
                  <CustomLink
                    href={item.href}
                    className="flex items-center text-primary mb-0"
                    isActive={pathname === item.href}
                  >
                    {item.name}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
