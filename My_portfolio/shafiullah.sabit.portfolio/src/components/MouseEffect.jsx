import React from "react";
import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    // hide default cursor
    document.body.style.cursor = "none";

    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const addHover = () => setIsHover(true);
    const removeHover = () => setIsHover(false);

    window.addEventListener("mousemove", move);

    // detect hover on clickable elements
    document.querySelectorAll("a, button, input, textarea").forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", move);

      document.querySelectorAll("a, button, input, textarea").forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <Motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div className="w-2 h-2 rounded-full bg-cyan-400" />
      </Motion.div>

      {/* Ring */}
      <Motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        animate={{
          x: pos.x - 16,
          y: pos.y - 16,
          scale: isHover ? 1.6 : 1,
          opacity: isHover ? 0.6 : 0.4,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="w-8 h-8 rounded-full border border-cyan-400" />
      </Motion.div>
    </>
  );
};

export default CustomCursor;
