import React from "react";

const SidebarItem = ({
  icon,
  label,
  active,
  onClick,
  collapsed,
  variant = "default",
}) => {
  const isMuted = variant === "muted";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
        collapsed ? "lg:justify-center lg:px-2" : ""
      } ${
        active
          ? "border-cyan-200/20 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.16)]"
          : isMuted
            ? "border-transparent text-white/50 hover:border-red-300/10 hover:bg-red-400/[0.08] hover:text-red-200"
            : "border-transparent text-white/60 hover:border-white/[0.06] hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base">
        {icon}
      </span>
      <span className={collapsed ? "lg:hidden" : ""}>{label}</span>
    </button>
  );
};

export default SidebarItem;
