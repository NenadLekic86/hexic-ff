"use client";

import React from "react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HowItWorks_NEW = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopImageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const octopusRef = useRef<HTMLDivElement>(null);
  const whaleRef = useRef<HTMLImageElement>(null);
  
  const currentStepRef = useRef(0);

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
    if (!stickyContainerRef.current) return;

    // Set initial states - show first step, hide others
    // Mobile images
    imageRefs.current.forEach((img, index) => {
      if (img) {
        gsap.set(img, { 
          opacity: index === 0 ? 1 : 0,
          visibility: index === 0 ? 'visible' : 'hidden'
        });
      }
    });
    
    // Desktop images
    desktopImageRefs.current.forEach((img, index) => {
      if (img) {
        gsap.set(img, { 
          opacity: index === 0 ? 1 : 0,
          visibility: index === 0 ? 'visible' : 'hidden'
        });
      }
    });
    
    // Mobile content
    contentRefs.current.forEach((content, index) => {
      if (content) {
        gsap.set(content, { 
          y: index === 0 ? 0 : 30, 
          opacity: index === 0 ? 1 : 0,
          visibility: index === 0 ? 'visible' : 'hidden'
        });
      }
    });
    
    // Desktop content
    desktopContentRefs.current.forEach((content, index) => {
      if (content) {
        gsap.set(content, { 
          y: index === 0 ? 0 : 30, 
          opacity: index === 0 ? 1 : 0,
          visibility: index === 0 ? 'visible' : 'hidden'
        });
      }
    });

    // Set initial state for octopus - hidden initially
    if (octopusRef.current) {
      gsap.set(octopusRef.current, {
        visibility: 'hidden',
        opacity: 0,
        scale: 0.8,
        y: 50,
      });
    }

    // Function to update active step
    const updateActiveStep = (currentStep: number) => {
      
      // Handle mobile images
      imageRefs.current.forEach((img, index) => {
        if (img) {
          if (index === currentStep) {
            gsap.set(img, { visibility: 'visible', opacity: 1 });
          } else {
            gsap.set(img, { visibility: 'hidden', opacity: 0 });
          }
        }
      });
      
      // Handle desktop images
      desktopImageRefs.current.forEach((img, index) => {
        if (img) {
          if (index === currentStep) {
            gsap.set(img, { visibility: 'visible', opacity: 1 });
          } else {
            gsap.set(img, { visibility: 'hidden', opacity: 0 });
          }
        }
      });
      
      // Handle mobile content
      contentRefs.current.forEach((content, index) => {
        if (content) {
          if (index === currentStep) {
            gsap.set(content, { visibility: 'visible' });
            gsap.fromTo(content, 
              { y: 20, opacity: 0 },
              { 
                y: 0, 
                opacity: 1, 
                duration: 0.5,
                ease: "power2.out"
              }
            );
          } else {
            gsap.set(content, { visibility: 'hidden', opacity: 0, y: 20 });
          }
        }
      });
      
      // Handle desktop content
      desktopContentRefs.current.forEach((content, index) => {
        if (content) {
          if (index === currentStep) {
            gsap.set(content, { visibility: 'visible' });
            gsap.fromTo(content, 
              { y: 20, opacity: 0 },
              { 
                y: 0, 
                opacity: 1, 
                duration: 0.5,
                ease: "power2.out"
              }
            );
          } else {
            gsap.set(content, { visibility: 'hidden', opacity: 0, y: 20 });
          }
        }
      });

      // Show octopus when step 2 (index 1) is active
      if (octopusRef.current) {
        if (currentStep === 1) {
          // Show octopus during step 2
          gsap.to(octopusRef.current, {
            visibility: 'visible',
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          });
        } else {
          // Hide octopus for all other steps
          gsap.to(octopusRef.current, {
            scale: 0.8,
            opacity: 0,
            y: 50,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(octopusRef.current, { visibility: 'hidden' });
            }
          });
        }
      }
    };

    // Create the main scroll trigger for the sticky section
    const scrollTrigger = ScrollTrigger.create({
      trigger: stickyContainerRef.current,
      start: "top top",
      end: () => `+=${howItWorksSteps.length * window.innerHeight * 0.8}`, // Shorter scroll distance
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        // Calculate which step should be active based on scroll progress
        const progress = self.progress;
        const totalSteps = howItWorksSteps.length;
        
        // More responsive step calculation - transitions happen earlier
        let currentStep;
        if (progress < 0.2) {
          currentStep = 0;
        } else if (progress < 0.45) {
          currentStep = 1;
        } else if (progress < 0.7) {
          currentStep = 2;
        } else {
          currentStep = 3;
        }
        
        currentStep = Math.min(currentStep, totalSteps - 1);
        
        if (currentStep !== currentStepRef.current) {
          currentStepRef.current = currentStep;
          updateActiveStep(currentStep);
        }
      },
      onEnter: () => {
        if (currentStepRef.current !== 0) {
          currentStepRef.current = 0;
          updateActiveStep(0);
        }
      }
    });

    // Add floating animations for whale and octopus icons
    const addFloatingAnimation = (element: HTMLElement | null, delay: number = 0, range: number = -10) => {
      if (element) {
        gsap.to(element, {
          y: range,
          duration: 2.5,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          delay: delay,
        });
      }
    };

    // Apply floating animations with different ranges
    addFloatingAnimation(whaleRef.current, 0, -15);        // Whale: 15px range (bigger)
    addFloatingAnimation(octopusRef.current, 0.5, -5);     // Octopus: 5px range (smaller)

    // Initialize first step after a brief delay to ensure refs are set
    setTimeout(() => {
      // Ensure first step is visible on load for both mobile and desktop
      if (imageRefs.current[0]) {
        gsap.set(imageRefs.current[0], { visibility: 'visible', opacity: 1 });
      }
      if (desktopImageRefs.current[0]) {
        gsap.set(desktopImageRefs.current[0], { visibility: 'visible', opacity: 1 });
      }
      if (contentRefs.current[0]) {
        gsap.set(contentRefs.current[0], { visibility: 'visible', opacity: 1, y: 0 });
      }
      if (desktopContentRefs.current[0]) {
        gsap.set(desktopContentRefs.current[0], { visibility: 'visible', opacity: 1, y: 0 });
      }
      updateActiveStep(0);
    }, 200);

    // Cleanup function
    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [howItWorksSteps.length]);

  return (
    <section className="howitworks-section relative mb-24 md:mb-44" ref={containerRef}>
      {/* Whale icon - positioned absolutely outside the sticky container */}
      <div className="whale-icon absolute top-4 md:top-64 right-4 md:right-20 z-40">
        <Image 
          ref={whaleRef}
          className="w-[200px] md:w-[400px] h-auto" 
          src="/whale.svg" 
          alt="whale icon" 
          width={609} 
          height={242} 
        />
      </div>

      {/* Sticky container that will be pinned during scroll */}
      <div 
        ref={stickyContainerRef}
        className="sticky-container h-screen flex items-center justify-center"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          {/* Desktop Layout - Side by side */}
          <div className="hidden md:flex md:flex-row items-center justify-center gap-8 md:gap-0">
            
            {/* Left side - Images (sticky positioned) */}
            <div className="basis-full md:basis-2/5 relative h-[500px] md:h-[600px]" ref={imageContainerRef}>
              {howItWorksSteps.map((step, index) => (
                <div 
                  key={`desktop-image-${step.id}`}
                  ref={(el) => { desktopImageRefs.current[index] = el; }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image 
                    src={step.image} 
                    alt={`mobile${step.id}`} 
                    width={380} 
                    height={767} 
                    className="w-auto h-full max-w-[380px] max-h-[500px] md:max-h-[600px] object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Right side - Content */}
            <div className="basis-full md:basis-3/5 text-center md:text-left pl-0 md:pl-20 relative min-h-[400px]" ref={contentContainerRef}>
              {howItWorksSteps.map((step, index) => (
                <div 
                  key={`desktop-content-${step.id}`}
                  ref={(el) => { desktopContentRefs.current[index] = el; }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <div className="num-icon rounded-4xl bg-[#F8B30D] w-[72px] h-[72px] flex items-center justify-center shadow-[0_0_0_6px_rgba(13,74,121,0.1)] mx-auto md:ml-0 mb-5">
                    <p className="text-3xl md:text-4xl font-bold text-[#031A3E]">{step.number}</p>
                  </div>
                  <h3 className="my-5 text-2xl md:text-3xl font-bold text-white">{step.title}</h3>
                  <p className="text-lg leading-relaxed text-white/80">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="flex md:hidden flex-col items-center justify-center min-h-screen">
            
            {/* Mobile Image Container - Fixed Height with Relative Positioning */}
            <div className="w-full h-[450px] top-[100px] md:top-0 relative flex items-center justify-center mb-5">
              {howItWorksSteps.map((step, index) => (
                <div 
                  key={`mobile-image-${step.id}`}
                  ref={(el) => { 
                    // Assign to imageRefs for mobile
                    imageRefs.current[index] = el; 
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image 
                    src={step.image} 
                    alt={`mobile${step.id}`} 
                    width={380} 
                    height={767} 
                    className="w-auto h-[400px] max-w-[300px] object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Mobile Content Container - Fixed Height with Relative Positioning */}
            <div className="w-full h-[250px] top-[50px] md:top-0 relative flex items-center justify-center text-center px-4 mb-5">
              {howItWorksSteps.map((step, index) => (
                <div 
                  key={`mobile-content-${step.id}`}
                  ref={(el) => { 
                    // Assign to contentRefs for mobile
                    contentRefs.current[index] = el; 
                  }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-4"
                >
                  <div className="num-icon rounded-4xl bg-[#F8B30D] w-[72px] h-[72px] flex items-center justify-center shadow-[0_0_0_6px_rgba(13,74,121,0.1)] mx-auto mb-6">
                    <p className="text-3xl font-bold text-[#031A3E]">{step.number}</p>
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-base leading-relaxed text-white/80 max-w-sm">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Mobile Octopus - positioned between steps */}
            <div 
              ref={(el) => {
                // Only assign octopus ref on mobile
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                  octopusRef.current = el;
                }
              }}
              className="octopus-icon w-full flex justify-center py-6"
            >
              <Image 
                className="w-[180px] h-auto" 
                src="/octopus.svg" 
                alt="octopus icon" 
                width={271} 
                height={177} 
              />
            </div>
          </div>

          {/* Desktop Octopus icon - shows during step 2 */}
          <div 
            ref={(el) => {
              // Only set octopusRef for desktop version on larger screens
              if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                octopusRef.current = el;
              }
            }}
            className="octopus-icon hidden md:block absolute bottom-0 right-0 md:bottom-[-100px] md:right-10 z-50"
          >
            <Image 
              className="w-[200px] md:w-[300px] h-auto" 
              src="/octopus.svg" 
              alt="octopus icon" 
              width={464} 
              height={304} 
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks_NEW
