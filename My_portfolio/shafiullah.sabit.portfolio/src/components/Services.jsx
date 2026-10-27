import React, { useEffect, useRef, useState } from "react";
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
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

const ServiceCard = ({ item, slideIndex }) => {
  return (
    <Motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={
        Number.isInteger(slideIndex)
          ? "group relative h-full min-h-64 overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-5 shadow-[0_0_40px_rgba(0,255,255,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_70px_rgba(0,255,255,0.10)] sm:rounded-3xl sm:p-6"
          : "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-5 shadow-[0_0_40px_rgba(0,255,255,0.06)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_70px_rgba(0,255,255,0.10)] sm:p-6"
      }
    >
      {Number.isInteger(slideIndex) && (
        <div className="relative z-10 mb-5 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200/60">
            Service {String(slideIndex + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-12 bg-gradient-to-r from-cyan-400/70 to-transparent" />
        </div>
      )}
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
        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border text-xl transition-all duration-300 ${
          Number.isInteger(slideIndex)
            ? "border-cyan-300/15 bg-cyan-400/10 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.15)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.10)]"
            : "border-white/10 bg-white/6 text-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.25)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.10)]"
        }`}
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
  const mobileCarouselRef = useRef(null);
  const [mobileSwiper, setMobileSwiper] = useState(null);
  const [activeService, setActiveService] = useState(0);
  const speed = 18;

  useEffect(() => {
    if (!mobileSwiper || !mobileCarouselRef.current) return undefined;

    let animationFrame;
    let resizeTimeout;
    const updateCarousel = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        if (!mobileSwiper.destroyed) mobileSwiper.update();
      });
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (!mobileSwiper.destroyed) mobileSwiper.update();
      }, 100);
    };

    const resizeObserver = new ResizeObserver(updateCarousel);
    resizeObserver.observe(mobileCarouselRef.current);
    window.addEventListener("resize", updateCarousel, { passive: true });
    window.addEventListener("orientationchange", updateCarousel);
    updateCarousel();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(resizeTimeout);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCarousel);
      window.removeEventListener("orientationchange", updateCarousel);
    };
  }, [mobileSwiper]);

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

      <div className="lg:hidden">
        <div
          ref={mobileCarouselRef}
          className="min-w-0 overflow-hidden rounded-3xl border border-cyan-300/10 bg-gradient-to-br from-cyan-950/35 via-slate-950/90 to-indigo-950/30 p-3 shadow-[0_16px_55px_rgba(0,0,0,0.3)] sm:p-5"
        >
        <Swiper
          modules={[Autoplay, Pagination]}
          onSwiper={setMobileSwiper}
          onResize={(swiper) => requestAnimationFrame(() => swiper.update())}
          onBreakpoint={(swiper) => requestAnimationFrame(() => swiper.update())}
          onSlideChange={(swiper) => setActiveService(swiper.realIndex)}
          loop
          speed={600}
          spaceBetween={12}
          slidesPerView={1}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true, type: "progressbar" }}
          breakpoints={{
            480: { slidesPerView: 1.15, spaceBetween: 14 },
            640: { slidesPerView: 2, spaceBetween: 18 },
            900: { slidesPerView: 2.4, spaceBetween: 20 },
          }}
          className="services-carousel !w-full !min-w-0 !overflow-visible !pb-8
            [&_.swiper-pagination-progressbar]:!bottom-0 [&_.swiper-pagination-progressbar]:!top-auto
            [&_.swiper-pagination-progressbar]:!h-1 [&_.swiper-pagination-progressbar]:!rounded-full
            [&_.swiper-pagination-progressbar]:!bg-white/10
            [&_.swiper-pagination-progressbar-fill]:!rounded-full
            [&_.swiper-pagination-progressbar-fill]:!bg-cyan-300"
        >
          {services.map((item, index) => (
            <SwiperSlide key={item.title} className="!h-auto">
              <ServiceCard item={item} slideIndex={index} />
            </SwiperSlide>
          ))}
        </Swiper>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium tabular-nums text-white/50">
              <span className="text-cyan-200">{String(activeService + 1).padStart(2, "0")}</span>
              <span className="mx-1.5 text-white/25">/</span>
              {String(services.length).padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous service"
                onClick={() => mobileSwiper?.slidePrev()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200"
              >
                <FaChevronLeft aria-hidden="true" size={13} />
              </button>
              <button
                type="button"
                aria-label="Next service"
                onClick={() => mobileSwiper?.slideNext()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 transition hover:bg-cyan-300/20"
              >
                <FaChevronRight aria-hidden="true" size={13} />
              </button>
            </div>
          </div>
        </div>
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
