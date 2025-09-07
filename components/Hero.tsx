"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PrimaryBtn, SecondaryBtn } from "@/components/Buttons";
import heroAnimData from "@/public/lottie/hexic_ff_hero_lottie.json";

const Lottie = dynamic(() => import("lottie-react"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg animate-pulse flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
    </div>
  )
});

const Hero = () => {
  return (
    <section className="hero-section relative pb-20 lg:p-0">
        {/* Background Overlay */}
        <div className="hero-section-overlay absolute top-0 left-0 w-full h-full">
            <div className="hero-section-overlay-top bg-[#40AFEC] min-h-[175px] relative"></div>
        </div>
        
        {/* Lottie Animation - Outside Container, Viewport Aligned */}
        <div className="absolute top-0 -right-3 w-full lg:w-1/2 h-auto flex items-start sm:items-center justify-center sm:justify-end z-10 hidden lg:flex">
            <div className="lottie-anim-container w-full max-w-lg lg:max-w-xl xl:max-w-2xl mt-0 relative">
                <div className="w-full aspect-square">
                    <Lottie 
                        animationData={heroAnimData}
                        loop={true}
                        autoplay={true}
                        className="w-full h-full z-10 relative"
                    />
                </div>
            </div>
        </div>
        
        {/* Content Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:pt-64 lg:pb-44 relative z-20">
            <div className="flex flex-col lg:flex-row items-center justify-start">
                <div className="basis-full md:basis-1/2 lg:order-2">
                    <div className="relative top-0 -right-[20px] sm:-right-[80px] md:-right-[160px] w-full h-auto z-10 lg:hidden">
                        <div className="lottie-anim-container w-full max-w-lg lg:max-w-xl xl:max-w-2xl mt-0 relative">
                            <div className="w-full aspect-square">
                                <Lottie 
                                    animationData={heroAnimData}
                                    loop={true}
                                    autoplay={true}
                                    className="w-full h-full z-10 relative"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="basis-full md:basis-3/5 lg:order-1 z-20">
                    {/* Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="font-black text-white mb-6" style={{
                            fontSize: 'clamp(32px, 5vw, 46px)',
                            lineHeight: 'clamp(120%, 1.2vw, 140%)'
                        }}>
                            Ahoy, Sailor! 👋 <br /> Trade Crypto in Telegram
                        </h1>
                        
                        <p className="text-white text-base md:text-lg mb-8 leading-relaxed text-center lg:text-left">
                            Buy, sell, and hold cryptocurrencies effortlessly—no apps, no hassle. All you need is your Telegram account.
                        </p>
                        
                        <div className="flex items-center justify-center lg:justify-start gap-3 lg:gap-5 lg:flex-nowrap">
                            <PrimaryBtn>Start Swapping</PrimaryBtn>
                            <SecondaryBtn>Explore</SecondaryBtn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero
