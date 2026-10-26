import React from "react";
import {
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaChartPie,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import SidebarItem from "./SidebarItem";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  onNavigate,
  handleLogout,
}) => {
  const items = [
    { id: "overview", label: "Overview", icon: <FaChartPie /> },
    { id: "contacts", label: "Contact messages", icon: <FaComments /> },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#080b11]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-[width,transform] duration-300 lg:w-[var(--dashboard-sidebar-width)] ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 font-bold text-black shadow-[0_0_25px_rgba(34,211,238,0.22)]">
            SS
          </div>
          <div className={`${sidebarOpen ? "block" : "lg:hidden"}`}>
            <p className="truncate text-sm font-bold text-white">Sabit</p>
            <p className="text-xs text-white/45">Portfolio admin</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Expand sidebar"}
          title={sidebarOpen ? "Close sidebar" : "Expand sidebar"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-cyan-400/30 hover:bg-white/10 hover:text-cyan-200"
        >
          <span className="lg:hidden">
            <FaTimes />
          </span>
          <span className="hidden lg:inline">
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </span>
        </button>
      </div>

      <p
        className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 ${
          sidebarOpen ? "block" : "lg:hidden"
        }`}
      >
        Workspace
      </p>
      <nav aria-label="Dashboard navigation" className="flex flex-1 flex-col gap-2">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeSection === item.id}
            onClick={() => {
              setActiveSection(item.id);
              onNavigate();
            }}
            collapsed={!sidebarOpen}
          />
        ))}
      </nav>

      <div className="border-t border-white/10 pt-4">
        <div
          className={`mb-3 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3 ${
            sidebarOpen ? "flex" : "lg:hidden"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 text-xs font-bold text-slate-950">
            SS
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold text-white">
              Shafiullah Sabit
            </span>
            <span className="mt-0.5 block text-[10px] text-emerald-300">
              Administrator
            </span>
          </span>
        </div>
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Sign out"
          onClick={handleLogout}
          collapsed={!sidebarOpen}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
