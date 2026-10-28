import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Overview from "./Overview";
import ContactMessages from "./ContactMessages";
import Analytics from "./Analytics";
import Settings from "./Settings";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import ConfirmDialog from "./ConfirmDialog";
import "./dashboard-theme.css";

const THEME_STORAGE_KEY = "portfolio-dashboard-theme";
const DEFAULT_PROFILE = {
  display_name: "Shafiullah Sabit",
  accent_color: "#22d3ee",
  avatar_path: null,
  avatar_url: null,
};

const Dashboard = () => {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) === "light"
        ? "light"
        : "dark";
    } catch (error) {
      console.error("Unable to read the dashboard theme preference:", error);
      return "dark";
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    window.matchMedia("(min-width: 1024px)").matches,
  );
  const [activeSection, setActiveSection] = useState("overview");
  const [adminProfile, setAdminProfile] = useState(DEFAULT_PROFILE);
  const [profileStatus, setProfileStatus] = useState("loading");
  const [profileError, setProfileError] = useState("");
  const [adminUser, setAdminUser] = useState({ id: "", email: "" });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const sectionTitles = {
    overview: "Overview",
    contacts: "Contact messages",
    analytics: "Analytics",
    settings: "Settings",
  };
  const activeTitle = sectionTitles[activeSection] || "Overview";

  const loadAdminProfile = useCallback(async () => {
    if (!supabase) {
      setProfileError("Supabase is not configured.");
      setProfileStatus("error");
      return;
    }

    setProfileStatus("loading");
    setProfileError("");
    try {
      const { data: userResult, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userResult.user) throw new Error("Sign in again to manage settings.");

      setAdminUser({
        id: userResult.user.id,
        email: userResult.user.email || "",
      });

      const { data, error: profileQueryError } = await supabase
        .from("admin_profiles")
        .select("display_name, accent_color, avatar_path")
        .eq("user_id", userResult.user.id)
        .maybeSingle();
      if (profileQueryError) throw profileQueryError;

      let avatarUrl = null;
      if (data?.avatar_path) {
        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from("admin-avatars")
            .createSignedUrl(data.avatar_path, 60 * 60);
        if (signedUrlError) throw signedUrlError;
        avatarUrl = signedUrlData.signedUrl;
      }

      setAdminProfile({
        ...DEFAULT_PROFILE,
        ...data,
        avatar_url: avatarUrl,
      });
      setProfileStatus("ready");
    } catch (error) {
      console.error("Unable to load admin profile settings:", error);
      setProfileError(
        error.message || "Unable to load administrator profile settings.",
      );
      setProfileStatus("error");
    }
  }, []);

  useEffect(() => {
    loadAdminProfile();
  }, [loadAdminProfile]);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch (error) {
        console.error("Unable to save the dashboard theme preference:", error);
      }
      return nextTheme;
    });
  };

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
      className="dashboard-shell relative min-h-screen bg-black text-white"
      data-theme={theme}
      style={{
        "--dashboard-sidebar-width": sidebarOpen ? "16rem" : "5rem",
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style:
            theme === "light"
              ? { background: "#ffffff", color: "#172033" }
              : { background: "#111827", color: "#f8fafc" },
        }}
      />

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
        profile={adminProfile}
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
          theme={theme}
          onThemeToggle={toggleTheme}
        />

        {activeSection === "overview" && (
          <Overview onNavigate={setActiveSection} />
        )}
        {activeSection === "contacts" && <ContactMessages />}
        {activeSection === "analytics" && (
          <Analytics onNavigate={setActiveSection} />
        )}
        {activeSection === "settings" && (
          <Settings
            profile={adminProfile}
            profileStatus={profileStatus}
            profileError={profileError}
            userId={adminUser.id}
            userEmail={adminUser.email}
            onRetry={loadAdminProfile}
            onProfileSaved={(profile) => {
              setAdminProfile(profile);
              setProfileStatus("ready");
            }}
            theme={theme}
            onThemeToggle={toggleTheme}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
