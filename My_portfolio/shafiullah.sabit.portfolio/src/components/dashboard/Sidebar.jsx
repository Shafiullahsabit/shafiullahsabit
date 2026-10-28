import React from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaChartPie,
  FaChartLine,
  FaComments,
  FaCog,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import SidebarItem from "./SidebarItem";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
  profile,
  onNavigate,
  handleLogout,
}) => {
  const items = [
    { id: "overview", label: "Overview", icon: <FaChartPie /> },
    { id: "analytics", label: "Analytics", icon: <FaChartLine /> },
    { id: "contacts", label: "Contact messages", icon: <FaComments /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden border-r border-cyan-300/10 bg-[#070a10]/95 p-3 shadow-[12px_0_32px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-[width,transform] duration-300 sm:p-4 lg:w-[var(--dashboard-sidebar-width)] ${
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
            <div
              className="dashboard-profile-avatar flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-cyan-300/10 text-base transition-transform duration-300 hover:scale-110"
              style={{
                borderColor: `${profile.accent_color}80`,
                color: profile.accent_color,
                backgroundColor: `${profile.accent_color}20`,
              }}
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${profile.display_name} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUserShield aria-hidden="true" />
              )}
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-white/70 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 lg:hidden"
          >
            <FaTimes />
          </button>
          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Collapse dashboard sidebar"
              title="Collapse sidebar"
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-white/55 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 lg:flex"
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
            className="mx-auto mt-3 hidden h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-white/55 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 lg:flex"
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

      <div className="relative border-t border-white/10 pt-3">
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Sign out"
          onClick={handleLogout}
          collapsed={!sidebarOpen}
          variant="muted"
          compact
        />
      </div>
    </aside>
  );
};

export default Sidebar;
