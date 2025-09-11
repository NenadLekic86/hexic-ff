"use client";

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="footer relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* About Us */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-8 pb-20 md:pt-16 md:pb-48">
            <div className="basis-full basis-1/2">
              <h2 className="mb-6 text-center md:text-left">
                About Us
              </h2>
              <p className="text-base md:text-lg mb-8 md:mb-0 leading-relaxed text-center lg:text-left">
              Lorem ipsum dolor sit amet consectetur. Arcu egestas egestas scelerisque nulla enim pretium. Nisi adipiscing in urna nisl. Eget amet sollicitudin viverra id eu pharetra est. Id odio blandit lobortis molestie. Semper pellentesque odio faucibus lacus ultricies commodo iaculis malesuada. Augue elit netus dolor ut. 
              </p>
            </div>
            <div className="basis-full basis-1/2 flex items-center justify-center">
              <Image src="/about-icon.webp" alt="a chest full of gold" width={359} height={370} />
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row items-center justify-center pb-5">
            {/* Left: Logo */}
            <div className="basis-full md:basis-3/12 pb-8 md:pb-0">
              <Link href="/" className="text-base font-semibold tracking-tight">
                <Image src="/logo.svg" alt="Hexic FF" width={200} height={51} />
              </Link>
            </div>
            {/* Footer Links */}
            <div className="basis-full md:basis-6/12 flex items-center justify-center pb-8 md:pb-0">
              <ul className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
                <li>
                  <Link className="text-[14px] hover:text-[#F8B30D] transition-all duration-200" href="/">Privacy Policy</Link>
                </li>
                <li>
                  <Link className="text-[14px] hover:text-[#F8B30D] transition-all duration-200" href="/">Terms of Service</Link>
                </li>
                <li>
                  <Link className="text-[14px] hover:text-[#F8B30D] transition-all duration-200" href="/">FAQs</Link>
                </li>
                <li>
                  <Link className="text-[14px] hover:text-[#F8B30D] transition-all duration-200" href="/">Careers</Link>
                </li>
                <li>
                  <Link className="text-[14px] hover:text-[#F8B30D] transition-all duration-200" href="/">Partner Programme</Link>
                </li>
              </ul>
            </div>
            {/* Social Media Links */}
            <div className="basis-full md:basis-3/12">
              <div className="flex flex-row items-center justify-center md:justify-end gap-4">
                <Link href="/">
                  <div className="bg-white rounded-full p-2 hover:bg-[#F8B30D] transition-all duration-200">
                      <Image className="hover:scale-110 transition-all duration-200 ease-in-out hover:brightness-0 hover:invert" src="/facebook_icon.svg" alt="Facebook" width={16} height={16} />
                  </div>
                </Link>
                <Link href="/">
                  <div className="bg-white rounded-full p-2 hover:bg-[#F8B30D] transition-all duration-200">
                    <Image className="hover:scale-110 transition-all duration-200 ease-in-out hover:brightness-0 hover:invert" src="/twitter_icon.svg" alt="Twitter" width={16} height={16} />
                  </div>
                </Link>
                <Link href="/">
                  <div className="bg-white rounded-full p-2 hover:bg-[#F8B30D] transition-all duration-200">
                    <Image className="hover:scale-110 transition-all duration-200 ease-in-out hover:brightness-0 hover:invert" src="/youtube_icon.svg" alt="YouTube" width={16} height={16} />
                  </div>
                </Link>
                <Link href="/">
                  <div className="bg-white rounded-full p-2 hover:bg-[#F8B30D] transition-all duration-200">
                    <Image className="hover:scale-110 transition-all duration-200 ease-in-out hover:brightness-0 hover:invert" src="/linkedin_icon.svg" alt="Linkedin" width={16} height={16} />
                  </div>
                </Link>
                <Link href="/">
                  <div className="bg-white rounded-full p-2 hover:bg-[#F8B30D] transition-all duration-200">
                    <Image className="hover:scale-110 transition-all duration-200 ease-in-out hover:brightness-0 hover:invert" src="/tiktok_icon.svg" alt="TikTok" width={16} height={16} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* Copyright */}
          <div className="text-center text-sm py-7 border-t border-white/10">
            <p>© 2025 Swaptain. All rights reserved.</p>
          </div>
        </div>
    </footer>
  )
}

export default Footer
