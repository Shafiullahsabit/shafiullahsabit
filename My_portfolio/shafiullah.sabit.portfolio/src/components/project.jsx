import React from "react";
import { FaGithub, FaExternalLinkAlt, FaMobileAlt } from "react-icons/fa";
import { portfolioProjects } from "../data/portfolioProjects";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Projects = () => {
  return (
    <section
      id="projects"
      className="
      relative z-10 px-4 sm:px-6 max-w-7xl mx-auto py-16 sm:py-20"
    >
      {/* Title */}
      <h2
        className="text-4xl sm:text-5xl font-bold text-white text-center"
      >
       My<span className="text-cyan-400">Project</span>
      </h2>

      {/* Description */}
      <p
        className="mt-4 mb-10 max-w-2xl mx-auto text-center text-white/60 text-sm sm:text-base"
      >
        A selection of web and mobile projects that showcase my skills,
        experience, and passion for building useful digital experiences.
      </p>

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        loop
        speed={800}
        spaceBetween={24}
        slidesPerView={1}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="!pb-12 !px-1 [&_.swiper-button-next]:!h-8 [&_.swiper-button-next]:!w-8 [&_.swiper-button-next]:!text-cyan-400 [&_.swiper-button-next::after]:!text-base [&_.swiper-button-prev]:!h-8 [&_.swiper-button-prev]:!w-8 [&_.swiper-button-prev]:!text-cyan-400 [&_.swiper-button-prev::after]:!text-base [&_.swiper-pagination-bullet]:!bg-white/50 [&_.swiper-pagination-bullet-active]:!bg-cyan-400"
      >
        {portfolioProjects.map((project) => (
          <SwiperSlide key={project.title} className="!h-auto">
            <div
              className="
                group relative flex h-full flex-col overflow-hidden rounded-2xl
                border border-white/10 bg-white/5 backdrop-blur-xl
                shadow-[0_0_40px_rgba(0,255,255,0.05)]
                transition-all duration-300 hover:-translate-y-2
                hover:shadow-[0_0_60px_rgba(0,255,255,0.2)]
              "
            >
              <div className="h-52 shrink-0 overflow-hidden">
                {project.images ? (
                  <div className="flex h-full items-center justify-center gap-2 bg-linear-to-br from-cyan-950 via-slate-900 to-indigo-950 px-2">
                    {project.images.map((image) => (
                      <img
                        key={image}
                        src={image}
                        alt={`${project.title} app preview`}
                        className="h-full min-w-0 flex-1 object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ))}
                  </div>
                ) : project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-linear-to-br from-cyan-950 via-slate-900 to-indigo-950">
                    <div className="flex h-40 w-24 flex-col items-center rounded-3xl border-4 border-white/30 bg-black/70 p-3 shadow-[0_0_35px_rgba(34,211,238,0.2)]">
                      <span className="mb-3 h-1 w-8 rounded-full bg-white/40" />
                      <FaMobileAlt className="mb-3 text-2xl text-cyan-400" />
                      <span className="text-center text-xs font-semibold text-white">
                        {project.category}
                      </span>
                      <span className="mt-3 h-1 w-12 rounded-full bg-cyan-400/70" />
                      <span className="mt-2 h-1 w-8 rounded-full bg-white/25" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <h3 className="text-xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex gap-4 pt-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-white/70 transition hover:text-cyan-400"
                  >
                    <FaGithub /> Code
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-white/70 transition hover:text-cyan-400"
                  >
                    <FaExternalLinkAlt /> Live
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Projects;
