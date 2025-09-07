"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { PrimaryBtnLink } from "@/components/Buttons";

export default function NavBar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isInnerPageOpen, setIsInnerPageOpen] = useState(false);
  const [hoverInnerPage, setHoverInnerPage] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const innerPageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cancelTimer = (ref: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) => {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  };

  const leaveWithDelay = (
    ref: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
    setOpen: (open: boolean) => void,
    delayMs = 200
  ) => {
    cancelTimer(ref);
    ref.current = setTimeout(() => setOpen(false), delayMs);
  };

  const toggleMobile = () => setIsMobileOpen((v) => !v);
  const closeMobile = () => setIsMobileOpen(false);

  const Arrow = ({ rotated = false, className = "", isMobile = false }: { rotated?: boolean; className?: string; isMobile?: boolean }) => (
    <svg
      className={`ml-2 transition-transform duration-200 ${rotated ? "rotate-180" : "rotate-0"} ${isMobile ? "h-[10px] w-[10px]" : "h-2 w-2"} ${className}`}
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M10.59 0.589844L6 5.16984L1.41 0.589844L0 1.99984L6 7.99984L12 1.99984L10.59 0.589844Z" fill="currentColor" />
    </svg>
  );

  return (
    <header className={`sticky ${isScrolled ? 'py-0 box-shadow-[0_4px_10px_rgba(0,0,0,0.1)]' : 'py-2'} top-0 z-50 transition-all duration-300 ${isMobileOpen ? `bg-[#40AFEC]` : `bg-[#40afec]`}`}>
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-19">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-base font-semibold tracking-tight">
              <Image src="/logo.svg" alt="Hexic FF" width={280} height={58} />
            </Link>
          </div>

          {/* Center: Main Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#"
              className="text-sm font-medium hover:bg-[#1A79B4] px-4 py-2 rounded transition-colors"
            >
              Inner Page
            </Link>
            
            <Link
              href="#"
              className="text-sm font-medium hover:bg-[#1A79B4] px-4 py-2 rounded transition-colors"
            >
              Inner Page
            </Link>

            {/* Inner Page with Dropdown */}
            <div className="relative">
              <Link
                href="#"
                className="text-sm font-medium hover:bg-[#1A79B4] px-4 py-2 rounded transition-colors flex items-center"
                onMouseEnter={() => {
                  cancelTimer(innerPageTimer);
                  setHoverInnerPage(true);
                }}
                onMouseLeave={() => leaveWithDelay(innerPageTimer, setHoverInnerPage)}
              >
                Inner Page
                <Arrow rotated={hoverInnerPage} />
              </Link>
              <div
                className={`absolute left-0 top-full ${
                  hoverInnerPage ? "block" : "hidden"
                } min-w-56 bg-background shadow-lg rounded-[19px] mt-2`}
                onMouseEnter={() => {
                  cancelTimer(innerPageTimer);
                  setHoverInnerPage(true);
                }}
                onMouseLeave={() => leaveWithDelay(innerPageTimer, setHoverInnerPage)}
              >
                <Link href="#" className="block px-4 py-2 text-sm hover:bg-[#1A79B4] rounded-t-[19px]">Inner Page</Link>
                <Link href="#" className="block px-4 py-2 text-sm hover:bg-[#1A79B4]">Inner Page</Link>
                <Link href="#" className="block px-4 py-2 text-sm hover:bg-[#1A79B4] rounded-b-[19px]">Inner Page</Link>
              </div>
            </div>
          </div>

          {/* Right: Button Link (Desktop) */}
          <div className="hidden md:flex">
            <PrimaryBtnLink href="#" className="!px-[20px]">
              Start Swapping
            </PrimaryBtnLink>
          </div>

          {/* Mobile: Hamburger on the right */}
          <div className="flex items-center md:hidden">
            <button
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              onClick={toggleMobile}
              className="hamburger-btn p-2 hover:cursor-pointer"
            >
              {/* Animated hamburger → X */}
              <div className="relative h-[14px] w-6">
                <span
                  className={`absolute right-0 block h-[2px] bg-current transition-all duration-200 ${
                    isMobileOpen ? "top-1/2 w-6 rotate-45" : "top-0 w-6 rotate-0"
                  }`}
                />
                <span
                  className={`absolute right-0 block h-[2px] bg-current transition-all duration-200 ${
                    isMobileOpen ? "top-1/2 w-0 opacity-0" : "top-[6px] w-[70%] opacity-100"
                  }`}
                />
                <span
                  className={`absolute right-0 block h-[2px] bg-current transition-all duration-200 ${
                    isMobileOpen ? "top-1/2 w-6 -rotate-45" : "top-[12px] w-6 rotate-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu panel (absolute, does not push content) */}
      <div
        aria-hidden={!isMobileOpen}
        className={`md:hidden absolute left-0 right-0 top-full z-40 bg-[#40AFEC] pt-10 pb-5 overflow-hidden transition-all duration-300 ease-in-out 
          ${isMobileOpen ? "opacity-100 translate-y-0 max-h-[85vh] pointer-events-auto" : "opacity-0 -translate-y-2 max-h-0 pointer-events-none"}
        `}
      >
        <div className="px-4">
          {/* Inner Page Links (mobile) */}
          <Link
            href="#"
            onClick={closeMobile}
            className="block py-4 px-4 text-lg font-medium"
          >
            Inner Page
          </Link>

          <Link
            href="#"
            onClick={closeMobile}
            className="block py-4 px-4 text-lg font-medium"
          >
            Inner Page
          </Link>

          {/* Inner Page with Dropdown (mobile) */}
          <div
            className={`w-full flex items-center justify-between py-4 text-lg font-medium ${
              isInnerPageOpen ? "bg-[#40AFEC]" : "bg-[#40AFEC]"
            } px-4`}
          >
            <Link href="#" onClick={closeMobile} className="flex-1">
              Inner Page
            </Link>
            <button
              aria-label={isInnerPageOpen ? "Collapse Inner Page" : "Expand Inner Page"}
              className="p-2 -mr-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsInnerPageOpen((v) => !v);
              }}
            >
              <Arrow rotated={isInnerPageOpen} isMobile={true} />
            </button>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isInnerPageOpen ? "max-h-60 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"
            }`}
          >
            <Link href="#" onClick={closeMobile} className="block px-8 py-4 text-lg bg-[#1A79B4]">Inner Page</Link>
            <Link href="#" onClick={closeMobile} className="block px-8 py-4 text-lg bg-[#1A79B4]">Inner Page</Link>
            <Link href="#" onClick={closeMobile} className="block px-8 py-4 text-lg bg-[#1A79B4]">Inner Page</Link>
          </div>

          {/* Button Link (mobile) */}
          <div className="py-7 px-4">
            <PrimaryBtnLink href="#" onClick={closeMobile} className="w-full">
              Start Swapping
            </PrimaryBtnLink>
          </div>
        </div>
      </div>
    </header>
  );
}


