// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Libre_Caslon_Display } from 'next/font/google';

// Import Libre Caslon Display font for project names
const libreCaslon = Libre_Caslon_Display({ subsets: ['latin'], weight: '400', display: 'swap' });

// Array of image paths for the carousel
const images = [
  '/heroContainer/heroPic1.jpg',
  '/heroContainer/heroPic2.jpg',
  '/heroContainer/heroPic3.jpg',
];

// Duration for each slide (in milliseconds)
const SLIDE_DURATION = 3000;

// Mapping of project names to hero images
const projectNames = [
  'Indian Beauty',
  'Divine Culture',
  'Modern kick',
];

// Navigation menu items
const navItems = ['Overview', 'Projects', 'Categories', 'Motion'];

/**
 * HeroCarousel Component
 * Displays a fullscreen carousel that cycles through three images with a cover effect:
 * The entering image slides in and covers the static existing image.
 */
const HeroCarousel: React.FC = () => {
  // State to keep track of the current image index
  const [current, setCurrent] = useState(0);
  // State to control the direction of the animation (1 for next, -1 for previous)
  const [direction, setDirection] = useState(1);
  // State to track if a transition is happening
  const [isTransitioning, setIsTransitioning] = useState(false);
  // State for the next image index
  const [next, setNext] = useState<number | null>(null);
  // State for the displayed index in the indicator
  const [displayedIndex, setDisplayedIndex] = useState(0);
  // State for hovered nav item
  const [hoveredNav, setHoveredNav] = useState<number | null>(null);
  // State for hover on 'More about ME' label
  const [hoveredMe, setHoveredMe] = useState(false);

  // Effect to auto-advance the carousel every SLIDE_DURATION ms
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setNext((current + 1) % images.length);
      setIsTransitioning(true);
      setDisplayedIndex((current + 1) % images.length); // Update indicator as soon as transition starts
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [current]);

  // Handler for when the animation is complete
  const handleAnimationComplete = () => {
    if (next !== null) {
      setCurrent(next);
      setNext(null);
      setIsTransitioning(false);
      setDisplayedIndex(next); // Ensure indicator stays correct after transition
    }
  };

  // Variants for the entering image (pure horizontal slide-in)
  const enterVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      zIndex: 2,
    }),
    animate: {
      x: 0,
      zIndex: 2,
      transition: {
        // Ultra-smooth spring for x: low stiffness, high damping, heavier mass, tiny restDelta
        x: { type: 'spring' as const, stiffness: 30, damping: 10, mass: 0.7, restDelta: 0.0005 },
      },
    },
    exit: {
      x: 0,
      zIndex: 2,
    },
  };

  return (
    // Fullscreen container using Tailwind CSS
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      {/* Render the current (static) image always */}
      <div className="absolute w-full h-full z-0">
        <Image
          src={images[current]}
          alt={`Hero Image ${current + 1}`}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      {/* If transitioning, render the entering image above and animate it */}
      <AnimatePresence>
        {isTransitioning && next !== null && (
          <motion.div
            key={next}
            custom={direction}
            variants={enterVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onAnimationComplete={handleAnimationComplete}
            className="absolute w-full h-full z-10"
            style={{ willChange: 'transform, opacity' }}
          >
            <Image
              src={images[next]}
              alt={`Hero Image ${next + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation menu above numbers in bottom left (vertical layout, dot left) */}
      <div className="absolute bottom-24 left-8 flex flex-col gap-4 z-20 select-none">
        {navItems.map((item, idx) => (
          <div
            key={item}
            className="flex flex-row items-center group cursor-pointer min-h-[3.5rem]"
            onMouseEnter={() => setHoveredNav(idx)}
            onMouseLeave={() => setHoveredNav(null)}
          >
            {/* White dot on hover, left of text, with extra margin */}
            <span
              className={`h-2 w-2 rounded-full mr-6 transition-all duration-200 ${
                hoveredNav === idx ? 'bg-white opacity-100' : 'opacity-0'
              }`}
            />
            <span
              className={`font-bold transition-transform duration-200 ${
                hoveredNav === idx
                  ? `${libreCaslon.className} text-white text-4xl scale-110` // Libre Caslon, scale up on hover
                  : 'text-white text-4xl font-bold' // Helvetica Bold by default, fixed size
              }`}
              style={hoveredNav === idx ? {} : { fontFamily: 'Helvetica Bold, Helvetica, Arial, sans-serif' }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
      {/* Numbered indicators for each hero image */}
      <div className="absolute bottom-8 left-8 flex gap-8 z-20 select-none">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`text-lg font-bold transition-all duration-300 ${
              idx === displayedIndex
                ? 'text-white opacity-100' // Highlight current/next
                : 'text-white opacity-50' // Faded for others
            }`}
            style={{ fontFamily: 'Helvetica Bold, Helvetica, Arial, sans-serif' }}
          >
            {String(idx + 1).padStart(2, '0')}
          </span>
        ))}
      </div>
      {/* Project name and View Project button at bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-full">
        {/* Project name (Libre Caslon Display) */}
        <span
          className={`mb-2 text-5xl text-white ${libreCaslon.className}`}
          style={{ letterSpacing: '0.02em' }}
        >
          {projectNames[displayedIndex]}
        </span>
        {/* View Project button */}
        <button className="px-4 py-1  text-white font-bold text-sm shadow-lg ">
          View Project
        </button>
      </div>
      {/* Scroll down indicator at bottom right */}
      <div className="absolute bottom-6 right-8 flex items-center gap-2 z-40 select-none">
        <span className={`text-white text-base text-xl ${libreCaslon.className}`}>Scroll down</span>
        {/* Down arrow SVG */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {/* More About me label at top right */}
      <div
        className="absolute top-6 right-8 flex items-center gap-1 z-40 select-none"
        onMouseEnter={() => setHoveredMe(true)}
        onMouseLeave={() => setHoveredMe(false)}
      >
        <span
          className="text-white text-lg font-bold"
          style={{ fontFamily: 'Helvetica Bold, Helvetica, Arial, sans-serif' }}
        >
          More about
        </span>
        <span
          className={`text-white text-2xl -mt-0.5 transition-all duration-200 ${hoveredMe ? libreCaslon.className : ''}`}
          style={hoveredMe ? {} : { fontFamily: 'Helvetica Bold, Helvetica, Arial, sans-serif' }}
        >
          ME
        </span>
      </div>
      {/* Top-left name branding */}
      <div
        className="fixed top-6 left-7 z-50 font-bold text-white text-2xl drop-shadow-lg select-none text-stroke-2 text-stroke-black"
        style={{ fontFamily: 'Helvetica Bold, Helvetica, Arial, sans-serif' }}
      >
        Ganti Akhil Sai
      </div>
      {/* Optional: Add overlay or controls here if needed */}
    </div>
  );
};

export default HeroCarousel;
