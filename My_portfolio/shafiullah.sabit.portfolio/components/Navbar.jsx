

import React, { useState } from "react";
import { motion as Motion, AnimatePresence  } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { FaTooth, FaBars, FaTimes } from "react-icons/fa";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Doctors", path: "/doctors" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <FaTooth className="text-indigo-600 text-2xl shrink-0" />
          <span className="text-base sm:text-lg font-extrabold tracking-wide text-slate-900">
            Noree <span className="text-indigo-600">Dentest</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
                        <NavLink
                to={link.path}
                className={({ isActive }) =>
                    `relative font-medium transition duration-300
                    ${isActive ? "text-indigo-600" : "text-slate-700 hover:text-indigo-600"}
                    after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-indigo-600
                    after:transition-all after:duration-300
                    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
                }
                >
                {link.name}
                </NavLink>

            </li>
          ))}
        </ul>

        {/* Desktop Button */}
        <Link
          to="/appointment"
          className="hidden md:inline-flex px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Appointment
        </Link>

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden text-2xl text-slate-800"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-slate-200"
          >
            <ul className="flex flex-col items-center gap-6 py-6">
              {navLinks.map((link) => (
                <li key={link.name}>
            <NavLink
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                    `relative text-lg font-medium transition duration-300
                    ${isActive ? "text-indigo-600" : "text-slate-700 hover:text-indigo-600"}
                    after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-indigo-600
                    after:transition-all after:duration-300
                    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
                }
                >
                {link.name}
                </NavLink>

                </li>
              ))}

              <Link
                to="/appointment"
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-8 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Appointment
              </Link>
            </ul>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
