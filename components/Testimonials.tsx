"use client";

import React, { useRef, useEffect } from 'react'
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { gsap } from 'gsap';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Testimonials = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const testimonials = [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum nunc nullam rutrum sed sollicitudin euismod nisl phasellus sit. Odio felis, pellentesque viverra amet habitasse. Imperdiet dis placerat mauris justo. Pellentesque netus viverra enim congue suscipit quam amet.",
      author: "@johndoe",
      avatar: "/person-1.webp"
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum nunc nullam rutrum sed sollicitudin euismod nisl phasellus sit. Odio felis, pellentesque viverra amet habitasse. Imperdiet dis placerat mauris justo. Pellentesque netus viverra enim congue suscipit quam amet.",
      author: "@johndoe",
      avatar: "/person-2.webp"
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum nunc nullam rutrum sed sollicitudin euismod nisl phasellus sit. Odio felis, pellentesque viverra amet habitasse. Imperdiet dis placerat mauris justo. Pellentesque netus viverra enim congue suscipit quam amet.",
      author: "@johndoe",
      avatar: "/person-3.webp"
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum nunc nullam rutrum sed sollicitudin euismod nisl phasellus sit. Odio felis, pellentesque viverra amet habitasse. Imperdiet dis placerat mauris justo. Pellentesque netus viverra enim congue suscipit quam amet.",
      author: "@johndoe",
      avatar: "/person-1.webp"
    },
    {
      id: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum nunc nullam rutrum sed sollicitudin euismod nisl phasellus sit. Odio felis, pellentesque viverra amet habitasse. Imperdiet dis placerat mauris justo. Pellentesque netus viverra enim congue suscipit quam amet.",
      author: "@johndoe",
      avatar: "/person-2.webp"
    },
    {
      id: 6,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum nunc nullam rutrum sed sollicitudin euismod nisl phasellus sit. Odio felis, pellentesque viverra amet habitasse. Imperdiet dis placerat mauris justo. Pellentesque netus viverra enim congue suscipit quam amet.",
      author: "@johndoe",
      avatar: "/person-3.webp"
    },
    {
      id: 7,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum nunc nullam rutrum sed sollicitudin euismod nisl phasellus sit. Odio felis, pellentesque viverra amet habitasse. Imperdiet dis placerat mauris justo. Pellentesque netus viverra enim congue suscipit quam amet.",
      author: "@johndoe",
      avatar: "/person-1.webp"
    },
  ];

  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const sharkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sharkElement = sharkRef.current;
    if (!sharkElement) return;

    // Create a timeline for the complete swimming animation
    const tl = gsap.timeline({ repeat: -1 });

    // Initial state - shark starts at its default position
    gsap.set(sharkElement, {
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1
    });

    // Phase 1: Swim to the left edge and completely off-screen
    tl.to(sharkElement, {
      x: -500, // Move completely beyond left edge (further off-screen)
      duration: 4,
      ease: "power2.inOut",
      // Add subtle vertical swimming motion
      y: "+=20",
    })
    // Add swimming wiggle motion during left swim
    .to(sharkElement, {
      rotation: -3,
      duration: 0.8,
      repeat: 4,
      yoyo: true,
      ease: "sine.inOut"
    }, 0) // Start at the same time as the main movement

    // Phase 2: Pause and rotate (shark turns around completely off-screen)
    .to(sharkElement, {
      scaleX: -1, // Flip horizontally
      rotation: 0,
      duration: 0.8,
      ease: "power2.inOut"
    })

    // Phase 3: Swim all the way to the right edge and off-screen (shorter off-screen distance)
    .to(sharkElement, {
      x: window.innerWidth + 150, // Reduced from +500 to +250 (half the off-screen distance)
      duration: 3,
      ease: "power2.inOut",
      // Add different vertical motion for variety
      y: "-=30",
    })
    // Add swimming wiggle motion during right swim
    .to(sharkElement, {
      rotation: 3,
      duration: 1,
      repeat: 5,
      yoyo: true,
      ease: "sine.inOut"
    }, "-=6") // Start with the main movement

    // Phase 4: Shorter pause off-screen and rotate back to original orientation
    .to(sharkElement, {
      scaleX: 1, // Flip back to original orientation
      rotation: 0,
      duration: 0.1, // Reduced from 0.8 to 0.4 seconds
      ease: "power2.inOut"
    })

    // Phase 5: Swim back from right side to default position (faster return)
    .to(sharkElement, {
      x: 0, // Return to default position
      y: 0, // Return to default vertical position
      duration: 5, // Reduced from 4 to 3 seconds
      ease: "power2.inOut",
    })
    // Add swimming wiggle motion during return swim
    .to(sharkElement, {
      rotation: -2,
      duration: 0.75, // Adjusted timing for shorter swim
      repeat: 3, // Reduced repeats for shorter swim
      yoyo: true,
      ease: "sine.inOut"
    }, "-=3") // Start with the return movement

    // Phase 6: Animate in place at default position (idle swimming) - ends at default position
    .to(sharkElement, {
      rotation: 2,
      duration: 0.6,
      repeat: 3, // Reduced to 3 repeats (1.8 seconds total)
      yoyo: true,
      ease: "sine.inOut"
    })
    // Add subtle vertical bobbing while idle - ends at default position
    .to(sharkElement, {
      y: "+=10",
      duration: 0.9,
      repeat: 1, // 1.8 seconds total (0.9 * 2 for yoyo)
      yoyo: true,
      ease: "sine.inOut"
    }, "-=1.8") // Start at the same time as rotation
    
    // Phase 7: Ensure we end exactly at default position (no glitch)
    .set(sharkElement, {
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1
    });

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="testimonials-section relative text-white py-16 md:py-24">
        {/* Shark icon - positioned absolutely outside the sticky container */}
        <div 
            ref={sharkRef}
            className="whale-icon absolute -top-[45px] md:-top-64 left-10 md:left-30 z-40"
            style={{ 
                transformOrigin: 'center center',
                willChange: 'transform' // Optimize for animations
            }}
        >
            <Image 
            className="w-[200px] md:w-[400px] h-auto" 
            src="/shark-icon.svg" 
            alt="shark icon" 
            width={414} 
            height={184} 
            />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="title-container relative mb-12 md:mb-16 z-30 flex justify-center md:justify-between items-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-0">
                    Testimonials
                </h2>
                
                {/* Navigation Buttons Tablet Desktop Only */}
                <div className="flex gap-4 hidden md:flex">
                    <button
                        onClick={handlePrevClick}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-[23px] bg-white hover:bg-[#F8B30D] transition-all duration-300 flex items-center justify-center shadow-[0_0_0_6px_rgba(13,74,121,0.1)] group cursor-pointer"
                        aria-label="Previous testimonial"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 16 16" 
                            fill="none"
                            className="group-hover:scale-110 transition-transform"
                        >
                            <path d="M15 9C15.5523 9 16 8.55228 16 8C16 7.44772 15.5523 7 15 7L15 8L15 9ZM0.292893 7.29289C-0.0976314 7.68342 -0.0976315 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538407 7.04738 0.538407 6.65686 0.928931L0.292893 7.29289ZM15 8L15 7L1 7L1 8L1 9L15 9L15 8Z" fill="#031A3E"/>
                        </svg>
                    </button>
                    <button
                        onClick={handleNextClick}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-[23px] bg-white hover:bg-[#F8B30D] transition-all duration-300 flex items-center justify-center shadow-[0_0_0_6px_rgba(13,74,121,0.1)] group cursor-pointer"
                        aria-label="Next testimonial"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 16 16" 
                            fill="none"
                            className="group-hover:scale-110 transition-transform"
                        >
                            <path d="M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9L1 8L1 7ZM15.7071 8.70711C16.0976 8.31658 16.0976 7.68342 15.7071 7.29289L9.34315 0.928932C8.95262 0.538408 8.31946 0.538408 7.92893 0.928932C7.53841 1.31946 7.53841 1.95262 7.92893 2.34315L13.5858 8L7.92893 13.6569C7.53841 14.0474 7.53841 14.6805 7.92893 15.0711C8.31946 15.4616 8.95262 15.4616 9.34315 15.0711L15.7071 8.70711ZM1 8L1 9L15 9V8V7L1 7L1 8Z" fill="#031A3E"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div className="testimonials-container relative px-4 sm:px-0">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                loop={true}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 1.5,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2.5,
                        spaceBetween: 25,
                    },
                    1024: {
                        slidesPerView: 3.5,
                        spaceBetween: 30,
                    },
                    1280: {
                        slidesPerView: 3.3,
                        spaceBetween: 30,
                        initialSlide: 1,
                    },
                }}
                slidesPerGroup={1}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                className="testimonials-swiper md:!-ml-24"
            >
                {testimonials.map((testimonial) => (
                    <SwiperSlide key={testimonial.id}>
                        <div className="testimonial-card bg-white backdrop-blur-sm rounded-4xl p-6 md:p-8 h-full border border-white hover:border-white/40 hover:bg-white/10 transition-all duration-300 group">
                            <div className="testimonial-content mb-6">
                                <p className="text-[#031A3E] group-hover:text-white transition-all duration-300 text-base leading-relaxed">
                                    &quot;{testimonial.text}&quot;
                                </p>
                            </div>
                            
                            <div className="testimonial-author flex items-center gap-4">
                                <div className="avatar-container">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full">
                                        <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={testimonial.avatar}
                                                alt={testimonial.author}
                                                width={56}
                                                height={56}
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="author-info">
                                    <p className="text-[#031A3E] group-hover:text-[#F8B30D] transition-all duration-300 font-bold text-lg">
                                        {testimonial.author}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation Buttons Mobile Only */}
            <div className="flex gap-4 flex-wrap items-center justify-center pt-7 md:hidden">
                <button
                    onClick={handlePrevClick}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-[23px] bg-white hover:bg-[#F8B30D] transition-all duration-300 flex items-center justify-center shadow-[0_0_0_6px_rgba(13,74,121,0.1)] group cursor-pointer"
                    aria-label="Previous testimonial"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16" 
                        fill="none"
                        className="group-hover:scale-110 transition-transform"
                    >
                        <path d="M15 9C15.5523 9 16 8.55228 16 8C16 7.44772 15.5523 7 15 7L15 8L15 9ZM0.292893 7.29289C-0.0976314 7.68342 -0.0976315 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538407 7.04738 0.538407 6.65686 0.928931L0.292893 7.29289ZM15 8L15 7L1 7L1 8L1 9L15 9L15 8Z" fill="#031A3E"/>
                    </svg>
                </button>
                <button
                    onClick={handleNextClick}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-[23px] bg-white hover:bg-[#F8B30D] transition-all duration-300 flex items-center justify-center shadow-[0_0_0_6px_rgba(13,74,121,0.1)] group cursor-pointer"
                    aria-label="Next testimonial"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16" 
                        fill="none"
                        className="group-hover:scale-110 transition-transform"
                    >
                        <path d="M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9L1 8L1 7ZM15.7071 8.70711C16.0976 8.31658 16.0976 7.68342 15.7071 7.29289L9.34315 0.928932C8.95262 0.538408 8.31946 0.538408 7.92893 0.928932C7.53841 1.31946 7.53841 1.95262 7.92893 2.34315L13.5858 8L7.92893 13.6569C7.53841 14.0474 7.53841 14.6805 7.92893 15.0711C8.31946 15.4616 8.95262 15.4616 9.34315 15.0711L15.7071 8.70711ZM1 8L1 9L15 9V8V7L1 7L1 8Z" fill="#031A3E"/>
                    </svg>
                </button>
            </div>
        </div>
    </section>
  )
}

export default Testimonials
