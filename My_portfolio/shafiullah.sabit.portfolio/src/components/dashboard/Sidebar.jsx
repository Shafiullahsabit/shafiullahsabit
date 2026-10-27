import React from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaChartPie,
  FaChartLine,
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
    { id: "analytics", label: "Analytics", icon: <FaChartLine /> },
    { id: "contacts", label: "Contact messages", icon: <FaComments /> },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden border-r border-cyan-300/10 bg-[#070a10]/95 p-3 shadow-[24px_0_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-[width,transform] duration-300 sm:p-4 lg:w-[var(--dashboard-sidebar-width)] ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl"
      />
      <div className="relative mb-8">
        <div
          className={`flex min-h-11 items-center gap-3 ${
            sidebarOpen ? "justify-between" : "justify-center"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-cyan-300 to-blue-500 font-black text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.24)]">
              SS
            </div>
            <div className={`${sidebarOpen ? "block" : "lg:hidden"}`}>
              <p className="truncate text-sm font-bold tracking-wide text-white">
                Sabit
              </p>
              <p className="text-xs text-white/45">Portfolio admin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close dashboard navigation"
            title="Close navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 lg:hidden"
          >
            <FaTimes />
          </button>
          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Collapse dashboard sidebar"
              title="Collapse sidebar"
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/55 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 lg:flex"
            >
              <FaChevronLeft />
            </button>
          )}
        </div>
        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Expand dashboard sidebar"
            title="Expand sidebar"
            className="mx-auto mt-3 hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/55 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 lg:flex"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      <p
        className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100/35 ${
          sidebarOpen ? "block" : "lg:hidden"
        }`}
      >
        Workspace
      </p>
      <nav
        aria-label="Dashboard navigation"
        className="relative flex flex-1 flex-col gap-2"
      >
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

      <div className="relative border-t border-white/10 pt-4">
        <div
          title={!sidebarOpen ? "Shafiullah Sabit · Administrator" : undefined}
          className={`mb-3 flex min-h-[4.25rem] items-center gap-3 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.02] ${
            sidebarOpen ? "px-3 py-2.5" : "justify-center p-1.5"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-100/20 bg-gradient-to-br from-cyan-300 to-blue-500 text-xs font-black text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
            SS
          </span>
          <span className={`min-w-0 ${sidebarOpen ? "block" : "lg:hidden"}`}>
            <span className="block truncate text-xs font-semibold text-white">
              Shafiullah Sabit
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-200/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Administrator
            </span>
          </span>
        </div>
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Sign out"
          onClick={handleLogout}
          collapsed={!sidebarOpen}
          variant="muted"
        />
      </div>
    </aside>
  );
};

export default Sidebar;
