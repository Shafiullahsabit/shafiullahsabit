import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState(
    isSupabaseConfigured
      ? ""
      : "Supabase is not configured. Set the required environment variables.",
  );
  const [signOutError, setSignOutError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    let active = true;
    const verifyAdmin = async (newSession) => {
      if (!active) return;
      setAuthError("");

      if (!newSession) {
        setSession(null);
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      try {
        const { data: admin, error } = await supabase.rpc("is_contact_admin");
        if (!active) return;
        if (error) throw error;
        setIsAdmin(admin === true);
      } catch (error) {
        if (!active) return;
        console.error("Unable to verify admin permissions:", error);
        setAuthError("Unable to verify administrator permissions. Please try again.");
        setIsAdmin(false);
      } finally {
        if (active) setIsChecking(false);
      }
    };

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsChecking(true);
      window.setTimeout(() => void verifyAdmin(newSession), 0);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-cyan-300">
        Checking admin session...
      </div>
    );
  }

  if (authError) {
    return (
      <div role="alert" className="flex min-h-screen items-center justify-center bg-black px-4 text-center text-red-200">
        {authError}
      </div>
    );
  }

  if (!session) return <Navigate to="/admin" replace />;
  if (!isAdmin) {
    const handleSignOut = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        console.error("Unable to sign out:", error);
        setSignOutError("Unable to sign out. Please try again.");
      }
    };

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-4 text-center text-white">
        <p role="alert" className="text-red-200">
          This account is not authorized to access the admin dashboard.
        </p>
        {signOutError && <p role="alert" className="text-red-200">{signOutError}</p>}
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:border-cyan-400/40"
        >
          Sign out
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
