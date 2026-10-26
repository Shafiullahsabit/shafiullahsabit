import React from "react";

const StatCard = ({ title, value, description, icon, isLoading = false }) => (
  <article className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_35px_rgba(0,255,255,0.04)] backdrop-blur-xl">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-white/60">{title}</p>
        {isLoading ? (
          <div className="mt-3 h-9 w-24 animate-pulse rounded-lg bg-white/10" />
        ) : (
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>
        )}
      </div>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 text-xl text-cyan-300">
        {React.createElement(icon, { "aria-hidden": true })}
      </span>
    </div>
    <p className="mt-3 text-xs text-white/40">{description}</p>
  </article>
);

export default StatCard;
