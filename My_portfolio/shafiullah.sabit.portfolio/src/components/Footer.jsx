import React, { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaArrowUp,
  FaArrowRight,
} from "react-icons/fa";
import { socialLinks } from "../data/socialLinks";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];
const whatsappLink = socialLinks.find((social) => social.label === "WhatsApp");

const scrollToSection = (event, sectionId) => {
  event.preventDefault();
  const section = document.getElementById(sectionId);
  if (!section) return;

  window.history.replaceState(null, "", `#${sectionId}`);
  const headerOffset = sectionId === "home" ? 0 : 88;
  const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, behavior: "smooth" });
};

const Footer = () => {
  const [hasLeftHomeSection, setHasLeftHomeSection] = useState(false);

  useEffect(() => {
    const updateHomeSectionVisibility = () => {
      const homeSection = document.getElementById("home");
      setHasLeftHomeSection(
        homeSection !== null && homeSection.getBoundingClientRect().bottom <= 0,
      );
    };

    updateHomeSectionVisibility();
    window.addEventListener("scroll", updateHomeSectionVisibility, {
      passive: true,
    });
    window.addEventListener("resize", updateHomeSectionVisibility);

    return () => {
      window.removeEventListener("scroll", updateHomeSectionVisibility);
      window.removeEventListener("resize", updateHomeSectionVisibility);
    };
  }, []);

  return (
    <>
      <footer className="relative overflow-hidden bg-transparent">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[min(90vw,48rem)] -translate-x-1/2 rounded-full bg-cyan-400/[0.07] blur-3xl"
        />
        <div className="relative mx-4 mt-10 max-w-7xl rounded-2xl border border-white/10 bg-white/5 px-5 py-6 shadow-[0_0_40px_rgba(0,255,255,0.04)] backdrop-blur-xl sm:mx-6 sm:mt-14 sm:px-6 sm:py-8 lg:mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-col gap-5 rounded-2xl border border-white/10 bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Have a project in mind?
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Let’s build something useful.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
                I create responsive websites, practical applications, and
                thoughtful digital experiences.
              </p>
            </div>
            <a
              href="#contact"
              onClick={(event) => scrollToSection(event, "contact")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-blue-400 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              Contact me <FaArrowRight aria-hidden="true" />
            </a>
          </Motion.div>

          <div className="grid gap-8 border-b border-white/10 pb-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr]">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <a
                href="#home"
                onClick={(event) => scrollToSection(event, "home")}
                aria-label="Shafiullah Sabit — back to home"
                className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-black text-cyan-300">
                  SS
                </span>
                <span className="text-lg font-bold text-white">
                  Shafiullah<span className="text-cyan-400"> Sabit</span>
                </span>
              </a>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
                A full-stack web and mobile app developer focused on building
                clean, scalable, and meaningful digital experiences.
              </p>
              <Link
                to="/admin"
                className="mt-4 inline-flex rounded-lg text-xs text-white/35 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Admin access
              </Link>
            </Motion.div>

            <Motion.nav
              aria-label="Footer navigation"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                Explore
              </h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                {footerLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      onClick={(event) =>
                        scrollToSection(event, href.slice(1))
                      }
                      className="text-sm font-bold text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </Motion.nav>

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                Connect with me
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                Follow my work or get in touch through your preferred platform.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
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
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-base text-white/70 transition hover:border-cyan-400 hover:text-white hover:shadow-[0_0_20px_rgba(0,255,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    >
                      <Icon aria-hidden="true" />
                    </Motion.a>
                  );
                })}
              </div>
            </Motion.div>
          </div>

          <div className="flex flex-col-reverse items-center justify-between gap-3 pt-5 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-white/35">
              © {new Date().getFullYear()} Shafiullah Sabit. All rights
              reserved.
            </p>
            <a
              href="#home"
              onClick={(event) => scrollToSection(event, "home")}
              className="inline-flex items-center gap-2 rounded-lg text-xs font-medium text-white/55 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              Back to home <FaArrowUp aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {hasLeftHomeSection && (
          <Motion.button
            type="button"
            aria-label="Scroll to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ y: 16, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ y: -4, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center
                       rounded-full border border-cyan-300/40 bg-slate-900/90 text-cyan-300
                       shadow-[0_0_24px_rgba(34,211,238,0.3)] backdrop-blur transition-colors
                       hover:bg-cyan-400 hover:text-slate-950"
          >
            <FaArrowUp size={18} />
          </Motion.button>
        )}
      </AnimatePresence>

      <Motion.a
        href={whatsappLink.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with me on WhatsApp"
        title="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14
                   bg-green-500 text-white rounded-full
                   flex items-center justify-center
                   shadow-[0_0_30px_rgba(34,197,94,0.6)]"
      >
        <FaWhatsapp size={30} />
      </Motion.a>
    </>
  );
};

export default Footer;
