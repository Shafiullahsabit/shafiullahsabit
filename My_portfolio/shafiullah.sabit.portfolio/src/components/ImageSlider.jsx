// import React from "react";
import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence  } from "framer-motion";

const images = ["/sabit1.jpg", "/4.jpeg", "/5.jpeg","/6.jpeg","/8.jpeg"];

const variants = {
  enter: {
    opacity: 0,
    scale: 0.92,
  },
  center: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 1.05,
  },
};

const ImageSlider = () => {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl">
      <AnimatePresence mode="wait">
        <Motion.img
          key={index}
          src={images[index]}
          alt="Portfolio preview"
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -80) {
              setIndex((prev) => (prev + 1) % images.length);
            } else if (offset.x > 80) {
              setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }
          }}
          className="absolute w-full h-full object-cover cursor-grab active:cursor-grabbing"
        />
      </AnimatePresence>

      {/* subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 pointer-events-none" />
    </div>
  );
};

export default ImageSlider;