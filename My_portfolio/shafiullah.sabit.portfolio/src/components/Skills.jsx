import React from "react";
import { motion as Motion } from "framer-motion";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaPhp,
  FaMobileAlt,
  FaShopify,
  FaWordpress,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiMysql,
  SiNextdotjs,
  SiDotnet,
  SiFlutter,
  SiPython,
  SiSqlite,
  SiFigma,
  SiBootstrap,
  SiNodedotjs,
  SiDocker,
  SiOpenai,
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";

const skills = [
  {
    name: "HTML5",
    icon: FaHtml5,
    color: "#e34f26",
    desc: "Semantic structure for modern and accessible web pages.",
  },
  {
    name: "CSS3",
    icon: FaCss3Alt,
    color: "#1572b6",
    desc: "Responsive layouts, animations, and clean UI styling.",
  },
  {
    name: "JavaScript",
    icon: FaJs,
    color: "#f7df1e",
    desc: "Interactive features, logic, and dynamic web behavior.",
  },
  {
    name: "Python",
    icon: SiPython,
    color: "#3776ab",
    desc: "Writing practical scripts and tools, including for web scraping.",
  },
  {
    name: "Figma",
    icon: SiFigma,
    color: "#f24e1e",
    desc: "Planning clear interfaces and turning designs into web experiences.",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "#06b6d4",
    desc: "Utility-first styling for fast and scalable UI design.",
  },
  {
    name: "React.js",
    icon: FaReact,
    color: "#61dafb",
    desc: "Component-based UI with smooth performance and UX.",
  },
  {
    name: "Flutter & Mobile Apps",
    icon: SiFlutter,
    color: "#54c5f8",
    desc: "Building mobile app interfaces for Android and iOS with Flutter.",
  },
  {
    name: "React Native",
    icon: FaMobileAlt,
    color: "#61dafb",
    desc: "Creating cross-platform mobile apps with React Native.",
  },
  {
    name: "Web Scraping",
    icon: SiPython,
    color: "#3776ab",
    desc: "Collecting and organizing useful data from websites with care.",
  },
  {
    name: "Next.js",
    icon: SiNextdotjs,
    color: "#ffffff",
    desc: "React framework for SEO, routing, and optimized apps.",
  },
  {
    name: "PHP",
    icon: FaPhp,
    color: "#777bb4",
    desc: "Backend development with authentication and CRUD systems.",
  },
  {
    name: "MySQL",
    icon: SiMysql,
    color: "#4479a1",
    desc: "Database design, queries, and secure data management.",
  },
  {
    name: "C#",
    icon: TbBrandCSharp,
    color: "#9b4f96",
    desc: "Strong OOP programming for desktop and system apps.",
  },
  {
    name: "WPF",
    icon: SiDotnet,
    color: "#512bd4",
    desc: "Modern desktop UI with MVVM and clean interfaces.",
  },
  {
    name: "Bootstrap",
    icon: SiBootstrap,
    color: "#7952b3",
    desc: "Building responsive layouts with Bootstrap components and utilities.",
  },
  {
    name: "Node.js",
    icon: SiNodedotjs,
    color: "#5fa04e",
    desc: "Creating server-side JavaScript tools and application services.",
  },
  {
    name: "Docker",
    icon: SiDocker,
    color: "#2496ed",
    desc: "Packaging applications and their dependencies in containers.",
  },
  {
    name: "SQLite",
    icon: SiSqlite,
    color: "#003b57",
    desc: "Lightweight relational database storage and SQL queries.",
  },
  {
    name: ".NET",
    icon: SiDotnet,
    color: "#512bd4",
    desc: "Working with the .NET platform to build applications.",
  },
  {
    name: "Prompt Engineering",
    icon: SiOpenai,
    color: "#10a37f",
    desc: "Shaping clear prompts to get more useful results from AI tools.",
  },
  {
    name: "Shopify",
    icon: FaShopify,
    color: "#7ab55c",
    desc: "E-commerce customization and store setup solutions.",
  },
  {
    name: "WordPress",
    icon: FaWordpress,
    color: "#21759b",
    desc: "Website creation with themes and plugin integrations.",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const card = {
  hidden: { opacity: 0, y: 28, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Skills = () => {
  return (
    <section
      id="skills"
      className="
        relative z-10 mx-auto w-full max-w-7xl
        px-4 py-16 sm:px-6 sm:py-20 md:px-8
      "
    >
      <Motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
          My <span className="text-cyan-400">Expertise</span>
        </h2>

        <p className="mx-auto mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
          I enjoy building useful digital experiences, from responsive websites
          and backend systems to mobile apps. These are some of the tools and
          technologies I work with.
        </p>
      </Motion.div>

      <Motion.h3
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="mb-7 mt-10 text-center text-xl font-semibold text-white sm:mb-9 sm:mt-12 sm:text-2xl"
      >
        Core <span className="text-cyan-400">Technologies</span>
      </Motion.h3>

      <Motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="
          grid
          grid-cols-2
          gap-3 sm:grid-cols-3 sm:gap-4
          md:grid-cols-4 lg:grid-cols-6
        "
      >
        {skills.map((skill) => {
          const Icon = skill.icon;

          return (
            <Motion.div
              key={skill.name}
              variants={card}
              whileHover={{ y: -5, scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              title={skill.desc}
              className="group relative flex h-24 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 text-center shadow-[0_0_24px_rgba(0,255,255,0.04)] backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(0,255,255,0.12)] sm:h-24 sm:gap-2"
            >
              <Motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -right-5 -top-5 h-12 w-12 rounded-full opacity-15 blur-xl transition-opacity duration-300 group-hover:opacity-35"
                style={{ backgroundColor: skill.color }}
              />

              <div
                className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-white/25"
                style={{ color: skill.color }}
              >
                <Icon aria-hidden="true" />
              </div>

              <h4 className="relative text-[11px] font-medium leading-tight text-white/80 transition-colors duration-300 group-hover:text-white sm:text-xs">
                {skill.name}
              </h4>
            </Motion.div>
          );
        })}
      </Motion.div>
    </section>
  );
};

export default Skills;
