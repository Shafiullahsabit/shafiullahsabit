import React from "react";
import { motion as Motion } from "framer-motion";
import {
  FaCode,
  FaLaptopCode,
  FaProjectDiagram,
  FaUserGraduate,
} from "react-icons/fa";

const About = () => {
  return (
    <section
      id="about"
      className="relative w-full
                 px-5 sm:px-8 lg:px-16
                 py-16 sm:py-20 overflow-hidden"
    >
      {/* 🌟 CONTENT */}
      <div
        className="relative z-10 max-w-7xl mx-auto w-full
                      grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center lg:pl-5 lg:pr-5"
      >
        {/* LEFT SIDE */}
        <Motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center lg:text-left"
        >
          <span
            className="inline-flex items-center gap-2 mb-5 px-4 py-1 rounded-full
                           bg-white/10 text-cyan-400 text-sm"
          >
            👨‍💻 About Me
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Full-stack Web Developer,
            <span className="block mt-2 text-cyan-400">
              Building Digital Experiences
            </span>
          </h2>

          <p
            className="mt-6 text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl
                        mx-auto md:text-center md:text-justify lg:text-left lg:mx-0"
          >
            I’m Shafiullah Sabit, a full-stack web developer who enjoys turning
            ideas into real, usable products.
          </p>

          <p
            className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl
                        mx-auto md:text-center md:text-justify lg:text-left lg:mx-0"
          >
            From frontend animations to backend logic, I love working across the
            full stack.
          </p>

          {/* STATS */}
          <div
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-xl
                          mx-auto lg:mx-0"
          >
            {[
              { label: "Projects", value: "4+" },
              { label: "Experience", value: "1 Year" },
              { label: "Clients", value: "4+" },
              { label: "Technologies", value: "10+" },
            ].map((item, i) => (
              <Motion.div
                key={i}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 180 }}
                className="rounded-2xl bg-white/5 border border-white/10
                           backdrop-blur-md py-4 text-center"
              >
                <h3 className="text-xl font-bold text-cyan-400">
                  {item.value}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{item.label}</p>
              </Motion.div>
            ))}
          </div>
        </Motion.div>

        {/* RIGHT SIDE */}
        <Motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {[
            {
              icon: <FaLaptopCode />,
              title: "Frontend Development",
              desc: "Modern, responsive, and animated interfaces.",
            },
            {
              icon: <FaCode />,
              title: "Backend Development",
              desc: "Secure and scalable backend systems.",
            },
            {
              icon: <FaProjectDiagram />,
              title: "Project-Based Approach",
              desc: "Real-world problem solving.",
            },
            {
              icon: <FaUserGraduate />,
              title: "Continuous Learning",
              desc: "Always improving skills.",
            },
          ].map((item, i) => (
            <Motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="rounded-3xl p-6 bg-white/5
                         border border-white/15 backdrop-blur-xl
                         hover:border-cyan-400/40
                         hover:shadow-[0_0_25px_rgba(0,255,255,0.25)]
                         transition-all duration-300"
            >
              <div className="text-3xl text-cyan-400 mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  );
};

export default About;
