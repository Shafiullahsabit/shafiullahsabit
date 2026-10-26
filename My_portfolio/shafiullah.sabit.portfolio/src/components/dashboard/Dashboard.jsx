import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Overview from "./Overview";
import ContactMessages from "./ContactMessages";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import ConfirmDialog from "./ConfirmDialog";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    window.matchMedia("(min-width: 1024px)").matches,
  );
  const [activeSection, setActiveSection] = useState("overview");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const activeTitle =
    activeSection === "contacts" ? "Contact messages" : "Overview";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("Unable to sign out:", error);
      toast.error("Unable to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-black text-white"
      style={{
        "--dashboard-sidebar-width": sidebarOpen ? "16rem" : "5rem",
      }}
    >
      <Toaster position="top-right" />

      {showLogoutConfirm && (
        <ConfirmDialog
          title="Sign out of the dashboard?"
          description="You will need to sign in again to manage your portfolio and contact messages."
          confirmLabel="Sign out"
          isConfirming={isLoggingOut}
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
        />
      )}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close dashboard navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onNavigate={() => {
          if (window.matchMedia("(max-width: 1023px)").matches) {
            setSidebarOpen(false);
          }
        }}
        handleLogout={() => setShowLogoutConfirm(true)}
      />

      <main
        className="ml-0 min-h-screen min-w-0 space-y-6 p-4 transition-[margin] duration-300 lg:ml-[var(--dashboard-sidebar-width)] sm:p-6"
      >
        <Header
          title={activeTitle}
          onMenuToggle={() => setSidebarOpen((isOpen) => !isOpen)}
        />

        {activeSection === "overview" && (
          <Overview onNavigate={setActiveSection} />
        )}
        {activeSection === "contacts" && <ContactMessages />}
      </main>
    </div>
  );
};

export default Dashboard;
