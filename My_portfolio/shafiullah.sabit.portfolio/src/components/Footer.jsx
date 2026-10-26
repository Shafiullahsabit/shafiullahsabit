import React, { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaArrowUp,
} from "react-icons/fa";

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
      {/* FOOTER */}

      <footer className="relative bg-black/70 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* ===== BRAND / INDEX ===== */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              Shafiullah Sabit
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              A full-stack web developer focused on building clean, scalable,
              and meaningful digital experiences that support growth, balance,
              and long-term success.
            </p>

            {/* ✅ Admin Access */}

            <div className="mt-4">
              <Link
                to="/admin"
                className="text-sm text-gray-400 hover:text-cyan-400 transition"
              >
                Sabit
              </Link>
            </div>
          </Motion.div>

          {/* ===== HEALTH OF WORK / PURPOSE ===== */}

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-3">
              Digital Well-Being
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              I believe healthy digital products are fast, accessible,
              user-friendly, and built with care. Good design and clean code
              improve both user experience and long-term project health.
            </p>
          </Motion.div>

          {/* ===== SOCIAL ===== */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-3">
              Connect With Me
            </h4>

            <div className="flex gap-4 mt-2">
              {[
                { icon: <FaGithub />, link: "https://github.com/Shafiullahsabit" },
                {
                  icon: <FaLinkedinIn />,
                  link: "https://www.linkedin.com/in/shafiullah-sabit-6482b5330/?originalSubdomain=af",
                },
                { icon: <FaFacebookF />, link: "https://www.facebook.com/shafi.ullah.sabit.17577/" },
                { icon: <FaWhatsapp />, link: "https://wa.me/93774256705" },
              ].map((item, i) => (
                <Motion.a
                  key={i}
                  href={item.link}
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="w-10 h-10 flex items-center justify-center
                             rounded-full border border-white/20
                             text-gray-300 hover:text-white
                             hover:border-cyan-400
                             hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]
                             transition"
                >
                  {item.icon}
                </Motion.a>
              ))}
            </div>
          </Motion.div>
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
        href="https://wa.me/93774256705"
        target="_blank"
        rel="noopener noreferrer"
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
