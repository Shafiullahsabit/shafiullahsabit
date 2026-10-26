import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import cvFile from "../CV/shafiullahsabit.pdf";

const Motion = motion;

// =====================
// Download CV
// =====================
const handleDownloadCV = () => {
  // Check if CV has already been downloaded
  const isDownloaded = localStorage.getItem("cvDownloaded");

  if (isDownloaded) {
    // CV is already downloaded, show snackbar or any other message
    alert("You have already downloaded the CV.");
    return; // Prevent download
  }

  // Proceed with download if it's not downloaded yet
  const link = document.createElement("a");
  link.href = cvFile;
  link.download = "shafiullahsabit.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Mark the CV as downloaded in localStorage
  localStorage.setItem("cvDownloaded", "true");
};

// =====================
// Nav Items (UNCHANGED)
// =====================
const navItems = [
  { id: 1, name: "Home", href: "#home" },
  { id: 2, name: "About", href: "#about" },
  { id: 3, name: "Skills", href: "#skills" },
  { id: 4, name: "Projects", href: "#projects" },
  { id: 6, name: "Services", href: "#services" },
  { id: 5, name: "Contact", href: "#contact" },
  { id: 7, name: "Download My CV", href: "#", isButton: true },
];

// =====================
// Animations
// =====================
const navVariants = {
  visible: { y: 0 },
  hidden: { y: -120 },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// =====================
// Navbar
// =====================
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  // =====================
  // Scroll progress bar
  // =====================
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // =====================
  // Hide on scroll
  // =====================
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY.current && currentY > 120);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // =====================
  // Active section detect
  // =====================
  useEffect(() => {
    const sections = navItems
      .filter((item) => !item.isButton)
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.6 },
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  // =====================
  // Nav click
  // =====================
  const handleNavClick = (e, item) => {
    e.preventDefault();

    if (item.isButton) {
      handleDownloadCV();
      setOpen(false);
      return;
    }

    setActive(item.href);
    const section = document.querySelector(item.href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  };

  return (
    <>
      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-cyan-400 z-60"
        style={{ width: progressWidth }}
      />

      <AnimatePresence>
        {!hidden && (
          <motion.nav
            variants={navVariants}
            initial="visible"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full z-50"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-4">
                {/* Logo */}
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Shafiullah<span className="text-cyan-400"> Sabit</span>
                </h1>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex items-center gap-4 xl:gap-8">
                  {navItems.map((item) => (
                    <li key={item.id} className="relative">
                      {item.isButton ? (
                        <button
                          onClick={(e) => handleNavClick(e, item)}
                          className="px-4 py-2 rounded-lg border border-blue-400 bg-blue-400/10 text-blue-400 font-semibold hover:bg-blue-400/20"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <>
                          <a
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item)}
                            className={`text-sm font-bold transition ${
                              active === item.href
                                ? "text-white"
                                : "text-white/70 hover:text-white"
                            }`}
                          >
                            {item.name}
                          </a>
                          {/* Active underline */}
                          <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${
                              active === item.href ? "w-full" : "w-0"
                            }`}
                          />
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Mobile Toggle */}
                <button
                  onClick={() => setOpen(!open)}
                  aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={open}
                  className="lg:hidden text-white"
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    {open ? (
                      <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>

              {/* Mobile Menu */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    variants={mobileMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mt-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 lg:hidden"
                  >
                    <ul className="flex flex-col gap-4">
                      {navItems.map((item) => (
                        <li key={item.id}>
                          {item.isButton ? (
                            <button
                              onClick={(e) => handleNavClick(e, item)}
                              className="w-full py-3 rounded-lg border border-blue-400 bg-blue-400/10 text-blue-400 font-semibold"
                            >
                              {item.name}
                            </button>
                          ) : (
                            <a
                              href={item.href}
                              onClick={(e) => handleNavClick(e, item)}
                              className={`block text-lg font-medium ${
                                active === item.href
                                  ? "text-cyan-400"
                                  : "text-white/80 hover:text-cyan-400"
                              }`}
                            >
                              {item.name}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
