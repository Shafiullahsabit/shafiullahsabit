import React, { useCallback, useEffect, useState } from "react";
import { motion as Motion, AnimatePresence  } from "framer-motion";

const images = [
  "/sabit1.jpg",
  "/4.jpeg",
  "/5.jpeg",
  "/6.jpeg",
  "/8.jpeg",
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.9,
    zIndex: 0,
  }),
};

const PremiumSlider = () => {
  const [[page, direction], setPage] = useState([0, 1]);

  const paginate = useCallback((newDirection) => {
    setPage(([prevPage, prevDirection]) => [
      (prevPage + newDirection + images.length) % images.length,
      -prevDirection,
    ]);
  }, []);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 4000);
    return () => clearInterval(interval);
  }, [paginate]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Glow/blur background */}
      <Motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-4 rounded-3xl 
                   bg-linear-to-tr from-cyan-400/20 to-indigo-500/20 blur-2xl"
      />

      {/* Slider images */}
      <AnimatePresence custom={direction} initial={false}>
        <Motion.img
          key={page}
          src={images[page]}
          alt={`Portfolio portrait ${page + 1}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 220, damping: 30 },
            opacity: { duration: 0.4, ease: "easeInOut" },
            scale: { duration: 0.4, ease: "easeInOut" },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -100) paginate(1);
            if (offset.x > 100) paginate(-1);
          }}
          className="absolute w-full h-full object-cover rounded-3xl cursor-grab active:cursor-grabbing shadow-lg"
        />
      </AnimatePresence>

      {/* Optional arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-2xl z-10"
      >
        ‹
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 text-2xl z-10"
      >
        ›
      </button>
    </div>
  );
};

export default PremiumSlider;
