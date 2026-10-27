import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaEnvelope,
  FaUser,
  FaRegCommentDots,
  FaCheckCircle,
  FaWhatsapp,
} from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { getContactMessageError } from "../lib/contactMessageErrors";
import { socialLinks } from "../data/socialLinks";

const contactEmail = "shafiuallahsabit@gmail.com";
const whatsappLink = socialLinks.find((social) => social.label === "WhatsApp");
const NOT_CONNECTED_MESSAGE =
  `The contact form is not connected yet. Please email me at ${contactEmail}.`;

const isJsonResponse = (response) =>
  (response.headers.get("content-type") || "").includes("application/json");

const insertContactMessage = async (message) => {
  if (!supabase) {
    const error = new Error(NOT_CONNECTED_MESSAGE);
    error.code = "NOT_CONNECTED";
    throw error;
  }

  const { error } = await supabase.from("contact_messages").insert(message);
  if (error) throw error;
};

const sendContactMessage = async (message) => {
  if (import.meta.env.DEV) {
    await insertContactMessage(message);
    return;
  }

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (isJsonResponse(response)) {
      if (response.ok) return;

      const result = await response.json();
      const error = new Error(result.message || "Unable to send your message.");
      error.code = result.code;
      throw error;
    }
  } catch (error) {
    if (error.code === "NOT_CONNECTED") throw error;
    if (supabase) {
      await insertContactMessage(message);
      return;
    }
    throw error;
  }

  await insertContactMessage(message);
};

const Contact = () => {
  const isMobileDevice =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const emailHref = isMobileDevice
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`
    : `mailto:${contactEmail}`;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFeedback(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!e.currentTarget.reportValidity()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const message = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        project_type: formData.projectType || null,
        message: formData.message.trim(),
      };

      await sendContactMessage(message);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        projectType: "",
        message: "",
      });
      setIsSent(true);
    } catch (error) {
      console.error("Unable to submit contact message:", error);
      setFeedback({
        type: "error",
        message:
          error.code === "NOT_CONNECTED"
            ? NOT_CONNECTED_MESSAGE
            : `${getContactMessageError(error, "Your message could not be sent right now.")} Please try again or contact me by email.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
  };

  return (
    <section
      id="contact"
      className="
      relative z-10 px-4 sm:px-6 max-w-7xl mx-auto py-16 sm:py-20
      "
    >
      {/* Title */}
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Contact <span className="text-cyan-400">Me</span>
        </h2>

        <p className="mt-4 mb-10 max-w-2xl mx-auto text-white/60 text-sm sm:text-base leading-relaxed">
          Let’s talk about your project. Send me a message and I’ll respond as
          soon as possible.
        </p>
      </Motion.div>

      {/* Main Grid */}
      <Motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8"
      >
        {/* LEFT SIDE */}
        <Motion.div
          variants={itemVariants}
          className="
            relative h-full overflow-hidden rounded-3xl border border-cyan-200/10
            bg-gradient-to-br from-[#101d2a] via-[#0b111b] to-[#090b12]
            p-6 shadow-[0_0_55px_rgba(0,255,255,0.08)]
            backdrop-blur-xl sm:p-8
          "
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl"
          />
          <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1 text-[11px] font-medium text-emerald-200/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]" />
            Available for opportunities
          </span>
          <h3 className="mb-3 mt-4 text-xl font-bold text-white sm:text-2xl">
            Let’s work together
          </h3>

          <p className="mb-6 text-sm leading-relaxed text-white/60 sm:text-base">
            I’m available for freelance projects and collaborations. Choose a
            method below to contact me quickly.
          </p>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              href={emailHref}
              target={isMobileDevice ? "_blank" : undefined}
              rel={isMobileDevice ? "noopener noreferrer" : undefined}
              aria-label={`Email ${contactEmail}`}
              className="
                group rounded-2xl border border-white/10 bg-white/[0.04] p-4
                transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/[0.06]
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex h-10 w-10 items-center justify-center rounded-xl
                    border border-cyan-300/15 bg-cyan-300/[0.08]
                    transition group-hover:border-cyan-300/30
                  "
                >
                  <FaEnvelope className="text-lg text-cyan-300" />
                </div>

                <div className="min-w-0 leading-tight">
                  <p className="text-white font-semibold text-sm">Email</p>
                  <p className="mt-1 truncate text-xs text-white/55">
                    {contactEmail}
                  </p>
                </div>
              </div>
            </Motion.a>

            <Motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              href={whatsappLink.href}
              target="_blank"
              rel="noreferrer"
              className="
                group rounded-2xl border border-white/10 bg-white/[0.04] p-4
                transition-all duration-300 hover:border-emerald-300/30 hover:bg-emerald-300/[0.06]
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    h-10 w-10 rounded-xl flex items-center justify-center
                    border border-emerald-300/15 bg-emerald-300/[0.08]
                    transition group-hover:border-emerald-300/30
                  "
                >
                  <FaWhatsapp className="text-lg text-emerald-300" />
                </div>

                <div className="leading-tight">
                  <p className="text-white font-semibold text-sm">WhatsApp</p>
                  <p className="text-white/55 text-xs">Quick chat</p>
                </div>
              </div>
            </Motion.a>
          </div>

          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Find me online
          </h4>
          <div className="mb-6 flex flex-wrap gap-2.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit my ${social.label} profile`}
                  title={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-base text-white/65 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  <Icon aria-hidden="true" />
                </a>
              );
            })}
          </div>

          <ul className="space-y-3 border-t border-white/10 pt-5 text-sm text-white/70 sm:text-base">
            <li className="flex items-start gap-3">
              <FaRegCommentDots className="text-cyan-400 mt-1 shrink-0" />
              Tell me what you want to build.
            </li>
            <li className="flex items-start gap-3">
              <FaUser className="text-cyan-400 mt-1 shrink-0" />
              I’ll reply fast with details.
            </li>
            <li className="flex items-start gap-3">
              <FaEnvelope className="text-cyan-400 mt-1 shrink-0" />
              We agree on timeline and start.
            </li>
          </ul>

          <p className="mt-6 text-white/45 text-xs sm:text-sm">
            💡 Tip: WhatsApp is the fastest way to reach me.
          </p>
          </div>
        </Motion.div>

        <Motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="
            rounded-2xl border border-white/10 bg-[#0d1017]/90
            p-6 shadow-[0_0_45px_rgba(0,255,255,0.07)]
            backdrop-blur-xl sm:p-8
          "
        >
          {isSent ? (
            <div
              role="status"
              aria-live="polite"
              className="flex min-h-[380px] flex-col items-center justify-center text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-500">
                <FaCheckCircle className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Thank you!</h3>
              <p className="mt-2 max-w-sm text-base leading-relaxed text-blue-200/80">
                Your message has been received. I'll get back to you within 24
                hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSent(false);
                  setFeedback(null);
                }}
                className="mt-6 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
          <h3 className="mb-5 text-xl font-bold text-white sm:text-2xl">
            Send a Message ✉️
          </h3>

          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              First name
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              maxLength={80}
              value={formData.firstName}
              onChange={handleChange}
              className="input-style"
              required
            />
            </label>
            <label className="block text-sm text-white/70">
              Last name
            <input
              type="text"
              name="lastName"
              autoComplete="family-name"
              maxLength={80}
              value={formData.lastName}
              onChange={handleChange}
              className="input-style"
              required
            />
            </label>
          </div>

          <label className="mb-4 block text-sm text-white/70">
            Email address
          <input
            type="email"
            name="email"
            autoComplete="email"
            maxLength={254}
            value={formData.email}
            onChange={handleChange}
            className="input-style mb-4"
            required
          />
          </label>

          <label className="mb-4 block text-sm text-white/70">
            Project type <span className="text-white/40">(optional)</span>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="input-style mt-1"
            >
              <option value="">Choose a project type</option>
              <option value="Website">Website</option>
              <option value="Mobile app">Mobile app</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="mb-5 block text-sm text-white/70">
            Message
            <textarea
              name="message"
              rows="5"
              minLength={1}
              maxLength={5000}
              value={formData.message}
              onChange={handleChange}
              className="input-style mt-1 resize-y"
              required
            />
          </label>

          {feedback && (
            <p
              role="status"
              className={`mb-4 rounded-xl border p-3 text-sm ${
                feedback.type === "success"
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                  : "border-red-400/30 bg-red-400/10 text-red-200"
              }`}
            >
              {feedback.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black shadow-[0_0_30px_rgba(34,211,238,0.45)] transition-all duration-300 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          <p className="mt-4 text-center text-white/45 text-xs sm:text-sm">
            I usually reply quickly 🚀
          </p>
            </>
          )}
        </Motion.form>
      </Motion.div>

      <style>
        {`
          .input-style {
            display: block;
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.15);
            color: white;
            outline: none;
            transition: all 0.3s ease;
            font-size: 0.95rem;
            margin-top: 0.35rem;
          }
          .input-style::placeholder {
            color: rgba(255,255,255,0.5);
          }
          .input-style option {
            color: #fff;
            background: #111827;
          }
          .input-style:focus {
            border-color: #22d3ee;
            box-shadow: 0 0 0 1px rgba(34,211,238,0.45);
          }
        `}
      </style>
    </section>
  );
};

export default Contact;
