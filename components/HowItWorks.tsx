"use client";

import React from "react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const whaleRef = useRef<HTMLImageElement>(null);
  const octopusRef = useRef<HTMLImageElement>(null);

  // Dynamic data for how it works steps
  const howItWorksSteps = [
    {
      id: 1,
      number: "01",
      image: "/mobile1.svg",
      title: "Fund your wallet",
      description: "Send BTC, ETH, BSC, RUNE, AVAC, ATOM, LTC, BNB, BCH, DOGE, Base or XRP to your wallet"
    },
    {
      id: 2,
      number: "02",
      image: "/mobile2.svg",
      title: "CHOOSE ASSET TO PAY WITH",
      description: "We allow ANY <> ANY asset swap, giving you the flexibility to choice what you pay with and amount to use for this transaction."
    },
    {
      id: 3,
      number: "03",
      image: "/mobile3.svg",
      title: "CHOOSE A TOKEN TO BUY",
      description: "Simply enter the contract address or symbol to purchase and confirm transaction."
    },
    {
      id: 4,
      number: "04",
      image: "/mobile4.svg",
      title: "Confirm transaction",
      description: "Select asset to receive and amount of the asset you wish to sell and confirm transaction"
    }
  ];

  useEffect(() => {
    // Set initial state - elements hidden and positioned below
    gsap.set([...imageRefs.current, ...contentRefs.current], {
      y: 100,
      opacity: 0,
    });

    // Set initial state for whale and octopus - hidden
    gsap.set([whaleRef.current, octopusRef.current], {
      opacity: 0,
      y: 50,
    });

    // Create scroll-triggered animations for each step
    stepsRef.current.forEach((step, index) => {
      if (step && imageRefs.current[index] && contentRefs.current[index]) {
        // Create timeline for this step
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 85%", // Animation starts when top of element hits 85% from top of viewport
            end: "bottom 20%",
            toggleActions: "play none none reverse", // Play on enter, reverse on leave
          },
        });

        // First animate the image (fly in from bottom)
        tl.to(imageRefs.current[index], {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        })
        // Then animate the content with 0.5s delay (fly in from bottom)
        .to(contentRefs.current[index], {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        }, "-=0.3"); // Start 0.3s before the image animation ends (0.5s total delay)
      }
    });

    // Create scroll-triggered fade-in animation for whale
    if (whaleRef.current) {
      gsap.timeline({
        scrollTrigger: {
          trigger: whaleRef.current,
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }).to(whaleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
      });
    }

    // Create scroll-triggered fade-in animation for octopus
    if (octopusRef.current) {
      gsap.timeline({
        scrollTrigger: {
          trigger: octopusRef.current,
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }).to(octopusRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
      });
    }

    // Add floating animations for whale and octopus (after fade-in)
    const addFloatingAnimation = (element: HTMLElement | null, delay: number = 0, range: number = -15, duration: number = 3) => {
      if (element) {
        gsap.to(element, {
          y: range,
          duration: duration,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          delay: delay + 1.2, // Start floating after fade-in completes
        });
      }
    };

    // Apply floating animations with different characteristics
    addFloatingAnimation(whaleRef.current, 0, -20, 4);        // Whale: 20px range, slower (4s)
    addFloatingAnimation(octopusRef.current, 1, -15, 3.5);    // Octopus: 15px range, medium speed (3.5s)

    // Add subtle rotation animation for more life-like movement (after fade-in)
    if (whaleRef.current) {
      gsap.to(whaleRef.current, {
        rotation: 2,
        duration: 6,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: 3.2, // Start after fade-in + 2s delay
      });
    }

    if (octopusRef.current) {
      gsap.to(octopusRef.current, {
        rotation: -1.5,
        duration: 5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.7, // Start after fade-in + 0.5s delay
      });
    }

    // Add subtle scale breathing effect (after fade-in)
    if (whaleRef.current) {
      gsap.to(whaleRef.current, {
        scale: 1.2,
        duration: 8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2.2, // Start after fade-in + 1s delay
      });
    }

    if (octopusRef.current) {
      gsap.to(octopusRef.current, {
        scale: 1.2,
        duration: 7,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: 3.7, // Start after fade-in + 2.5s delay
      });
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="howitworks-section relative mt-24 mb-10 md:mt-44 md:mb-0" ref={containerRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        {/* Whale icon */}
        <div className="whale-icon flex items-center justify-center">
          <Image 
            ref={whaleRef}
            className="relative md:absolute -right-5 -top-10 md:-top-16 md:right-20 w-[282px] md:w-[609px] h-auto" 
            src="/whale.svg" 
            alt="whale icon" 
            width={609} 
            height={242} 
          />
        </div>

        {howItWorksSteps.map((step, index) => (
          <React.Fragment key={`step-${step.id}`}>
            <div 
              ref={(el) => { stepsRef.current[index] = el; }}
              className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 ${index < howItWorksSteps.length - 1 ? 'mb-16 md:mb-24' : ''}`}
            >
              {/* Image */}
              <div 
                ref={(el) => { imageRefs.current[index] = el; }}
                className="basis-full md:basis-2/5"
              >
                <Image 
                  src={step.image} 
                  alt={`mobile${step.id}`} 
                  width={380} 
                  height={767} 
                  className="w-full h-auto max-w-[380px] mx-auto"
                />
              </div>
              
              {/* Content */}
              <div 
                ref={(el) => { contentRefs.current[index] = el; }}
                className="basis-full md:basis-3/5 text-center md:text-left pl-0 md:pl-20"
              >
                <div className="num-icon rounded-4xl bg-[#F8B30D] w-[72px] h-[72px] flex items-center justify-center shadow-[0_0_0_6px_rgba(13,74,121,0.1)] mx-auto md:ml-0 mb-5">
                  <p className="text-3xl md:text-4xl font-bold text-[#031A3E]">{step.number}</p>
                </div>
                <h3 className="my-5 text-2xl md:text-3xl font-bold text-white uppercase">{step.title}</h3>
                <p className="text-lg leading-relaxed text-white/80">{step.description}</p>
              </div>
            </div>
            
            {/* Show octopus after step 2 (between steps 2 and 3) */}
            {index === 1 && (
              <div className="octopus-icon relative flex items-center justify-center my-16 md:my-24">
                <Image 
                  ref={octopusRef}
                  className="md:absolute md:-right-10 md:-top-36 w-[271px] md:w-[400px] h-auto" 
                  src="/octopus.svg" 
                  alt="octopus icon" 
                  width={464} 
                  height={304} 
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
