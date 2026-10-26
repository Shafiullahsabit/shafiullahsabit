import React from "react";

const SidebarItem = ({ icon, label, active, onClick, collapsed }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
        collapsed ? "lg:justify-center lg:px-2" : ""
      } ${
        active
          ? "bg-cyan-400 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.18)]"
          : "text-white/65 hover:bg-white/[0.07] hover:text-white"
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
