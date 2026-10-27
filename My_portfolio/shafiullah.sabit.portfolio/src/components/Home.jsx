import React from "react";
import { motion as Motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import PremiumSlider from "./PremiumSlider";
import { socialLinks } from "../data/socialLinks";

const Home = () => {
  return (
    <section
      id="home"
      className="min-h-screen w-full flex items-center
                 px-5 sm:px-8 lg:px-16
                 pt-28 sm:pt-32 lg:pt-32"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center lg:px-5">
        {/* ================= LEFT CONTENT ================= */}
        <Motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="home-content text-center lg:text-left"
        >
          <span
            className="inline-block mb-5 px-4 py-1 rounded-full
                           bg-white/10 text-sm"
          >
            <Motion.span
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              transition={{ duration: 1.25, ease: "easeOut", delay: 0.4 }}
              className="inline-block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text font-semibold text-transparent"
            >
              👋 Asalamu Alaikum, I’m
            </Motion.span>
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
            Shafiullah Sabit
            <span className="block mt-2 text-cyan-400">
             Full-Stack Web & Mobile App Developer
            </span>
          </h1>

          <p className="home-description mt-6 text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
            I'm Shafiullah Sabit, a Full-Stack Web Developer and Mobile App Developer specializing in React, JavaScript, Tailwind CSS, and Flutter. I build modern, responsive, and user-friendly web and mobile applications that turn ideas into practical digital solutions.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-wrap gap-4 justify-center lg:justify-start">
            <Motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="flex items-center gap-2 px-7 py-3 rounded-xl
                         bg-cyan-400 text-black font-semibold
                         shadow-[0_0_25px_rgba(0,255,255,0.4)]"
            >
              View Projects <FaArrowRight />
            </Motion.a>

            <Motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="px-7 py-3 rounded-xl border border-white/30
                         text-white hover:bg-white/10 transition"
            >
              Contact Me
            </Motion.a>
            <Motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://aslicv.com/shafiullahsabit"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 rounded-xl bg-cyan-400 font-semibold text-black
                         shadow-[0_0_25px_rgba(0,255,255,0.4)] transition hover:bg-[rgba(0,255,255,0.4)]"
            >
              View Online CV
            </Motion.a>
          </div>

          {/* Social Icons */}
          <div className="mt-8 flex justify-center gap-3 lg:justify-start">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <Motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit my ${social.label} profile`}
                  title={social.label}
                  whileHover={{ y: -4, scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-white/70 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <Icon aria-hidden="true" />
                </Motion.a>
              );
            })}
          </div>
        </Motion.div>

        {/* ================= RIGHT IMAGE ================= */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <div
            className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
               h-90 sm:h-105 md:h-115 lg:h-130
               rounded-3xl overflow-hidden
               border border-white/20 backdrop-blur-xl
               bg-white/5 shadow-[0_0_60px_rgba(0,255,255,0.25)]  m-auto"
          >
            <PremiumSlider />
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default Home;
