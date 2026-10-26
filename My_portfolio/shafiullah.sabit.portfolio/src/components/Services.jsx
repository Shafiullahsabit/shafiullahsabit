import React from "react";
import { motion as Motion } from "framer-motion";
import {
  FaLaptopCode,
  FaServer,
  FaPaintBrush,
  FaPenNib,
  FaDatabase,
  FaMobileAlt,
  FaRocket,
  FaCode,
  FaGlobe,
} from "react-icons/fa";

const services = [
  {
    title: "Frontend Development",
    desc: "Modern UI with React, Tailwind CSS, animations, and smooth UX.",
    icon: <FaLaptopCode />,
  },
  {
    title: "Backend Development",
    desc: "Secure backend with PHP + MySQL and clean API structure.",
    icon: <FaServer />,
  },
  {
    title: "Responsive Web Design",
    desc: "Perfect layout for mobile, tablet, and desktop screens.",
    icon: <FaMobileAlt />,
  },
  {
    title: "Database Management",
    desc: "Well-structured database design with optimized queries.",
    icon: <FaDatabase />,
  },
  {
    title: "Graphic Designing",
    desc: "Clean designs for banners, thumbnails, UI visuals, and posts.",
    icon: <FaPaintBrush />,
  },
  {
    title: "Data Entry",
    desc: "Accurate and fast data entry with full responsibility.",
    icon: <FaPenNib />,
  },
  {
    title: "Website Optimization",
    desc: "Improve speed, UI polish, SEO basics, and performance.",
    icon: <FaRocket />,
  },
  {
    title: "Clean Code",
    desc: "Organized and maintainable code with best practices.",
    icon: <FaCode />,
  },
  {
    title: "Web Presence Setup",
    desc: "Portfolio websites, landing pages, and business pages.",
    icon: <FaGlobe />,
  },
];

const col1 = services.filter((_, i) => i % 3 === 0);
const col2 = services.filter((_, i) => i % 3 === 1);
const col3 = services.filter((_, i) => i % 3 === 2);

const loop = (arr) => [...arr, ...arr];

const ServiceCard = ({ item }) => {
  return (
    <Motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="
        group relative overflow-hidden
        rounded-2xl p-5 sm:p-6
        border border-white/10
        bg-white/4 backdrop-blur-xl
        shadow-[0_0_40px_rgba(0,255,255,0.06)]
        hover:shadow-[0_0_70px_rgba(0,255,255,0.10)]
        transition-all duration-300
      "
    >
      <div
        className="
          pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
          transition duration-500
        "
      >
        <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-cyan-400/35 via-indigo-500/25 to-cyan-400/35 blur-lg" />
      </div>

      <div
        className="
          pointer-events-none absolute -top-24 -left-24 h-56 w-56
          bg-white/10 blur-2xl rotate-12
          opacity-0 group-hover:opacity-100
          transition duration-700
        "
      />

      <div
        className="
          relative z-10
          h-12 w-12 rounded-2xl flex items-center justify-center
          border border-white/10
          bg-white/6
          text-cyan-400 text-xl
          shadow-[0_0_25px_rgba(34,211,238,0.25)]
          group-hover:shadow-[0_0_40px_rgba(34,211,238,0.10)]
          transition-all duration-300
        "
      >
        {item.icon}
      </div>

      <h3 className="relative z-10 mt-5 text-lg sm:text-xl font-bold text-white">
        {item.title}
      </h3>

      <p className="relative z-10 mt-2 text-white/60 text-sm leading-relaxed">
        {item.desc}
      </p>

      <div className="relative z-10 mt-5 h-0.5 w-10 bg-linear-to-r from-cyan-400 to-indigo-500 rounded-full group-hover:w-16 transition-all duration-300" />
    </Motion.div>
  );
};

const ServicesSlider = () => {
  const speed = 18;

  const upAnimation = {
    y: ["0%", "-50%"],
    transition: {
      duration: speed,
      repeat: Infinity,
      ease: "linear",
    },
  };

  const downAnimation = {
    y: ["-50%", "0%"],
    transition: {
      duration: speed,
      repeat: Infinity,
      ease: "linear",
    },
  };

  return (
    <section
      id="services"
      className="relative z-10 px-4 sm:px-6 max-w-7xl mx-auto py-16 sm:py-20 w-full"
    >
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          My <span className="text-cyan-400">Services</span>
        </h2>

        <p className="mt-4 mb-10 max-w-2xl mx-auto text-white/60 text-sm sm:text-base leading-relaxed">
          I provide high-quality services with clean design, strong performance,
          and modern development standards Websites and Database.
        </p>
      </Motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
        {services.map((item) => (
          <ServiceCard key={item.title} item={item} />
        ))}
      </div>

      <div
        className="
          relative hidden h-150 overflow-hidden
          rounded-3xl border border-white/10
          bg-white/3 p-7 backdrop-blur-2xl
          shadow-[0_0_60px_rgba(0,255,255,0.06)]
          lg:block
        "
      >
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-20 w-full bg-linear-to-b from-black/70 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-20 w-full bg-linear-to-t from-black/70 to-transparent" />

        <div className="grid h-full grid-cols-3 gap-5">
          <div className="relative overflow-hidden">
            <Motion.div animate={upAnimation} className="flex flex-col gap-5">
              {loop(col1).map((item, idx) => (
                <ServiceCard key={`l-${idx}`} item={item} />
              ))}
            </Motion.div>
          </div>

          <div className="relative overflow-hidden">
            <Motion.div animate={downAnimation} className="flex flex-col gap-5">
              {loop(col2).map((item, idx) => (
                <ServiceCard key={`c-${idx}`} item={item} />
              ))}
            </Motion.div>
          </div>

          <div className="relative overflow-hidden">
            <Motion.div animate={upAnimation} className="flex flex-col gap-5">
              {loop(col3).map((item, idx) => (
                <ServiceCard key={`r-${idx}`} item={item} />
              ))}
            </Motion.div>
          </div>
        </div>
      </div>

      <Motion.p
        initial={{ opacity: 0, y: -12 }}
        whileInView={{
          opacity: 1,
          y: 0,
          color: ["#7dd3fc", "#38bdf8", "#0ea5e9", "#38bdf8", "#7dd3fc"],
        }}
        transition={{
          delay: 0.2,
          duration: 0.6,
          color: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        }}
        viewport={{ once: true }}
        className="mt-10 text-center text-sm"
      >
        ⚡ Want a custom service? Message me anytime — I reply fast.
      </Motion.p>
    </section>
  );
};

export default ServicesSlider;
