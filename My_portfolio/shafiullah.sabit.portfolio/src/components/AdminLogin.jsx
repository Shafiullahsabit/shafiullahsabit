import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import Particles from "./Particles.jsx";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;
    supabase.auth
      .getSession()
      .then(async ({ data, error }) => {
        if (error) {
          console.error("Unable to check admin session:", error);
          return;
        }
        if (!active || !data.session) return;

        const { data: isAdmin, error: roleError } =
          await supabase.rpc("is_contact_admin");
        if (roleError) {
          console.error("Unable to verify administrator permissions:", roleError);
          return;
        }
        if (active && isAdmin) navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        console.error("Unable to check admin session:", error);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      toast.error("Admin login is not configured. Set the Supabase environment variables.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (loginError) {
        console.error("Admin sign-in failed:", loginError);
        toast.error("Unable to sign in. Check your credentials and try again.");
        return;
      }

      const { data: isAdmin, error: roleError } =
        await supabase.rpc("is_contact_admin");
      if (roleError) {
        console.error("Unable to verify administrator permissions:", roleError);
        try {
          const { error: signOutError } = await supabase.auth.signOut();
          if (signOutError) throw signOutError;
        } catch (signOutError) {
          console.error("Unable to clear unverified admin session:", signOutError);
        }
        toast.error("Unable to verify administrator access. Please try again.");
        return;
      }
      if (!isAdmin) {
        try {
          const { error: signOutError } = await supabase.auth.signOut();
          if (signOutError) throw signOutError;
        } catch (signOutError) {
          console.error("Unable to clear unauthorized session:", signOutError);
        }
        toast.error("This account is not authorized to access the dashboard.");
        return;
      }

      toast.success("Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (loginError) {
      console.error("Admin sign-in failed:", loginError);
      toast.error("Unable to sign in right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Toaster position="bottom-center" />
      <div className="absolute inset-0">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(0,255,255,0.08)] backdrop-blur-xl"
        >
          <h2 className="mb-6 text-center text-3xl font-bold">
            Admin <span className="text-cyan-400">Login</span>
          </h2>
          <p className="mb-8 text-center text-sm text-white/60">
            Sign in with your authorized administrator account.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block text-sm text-white/70">
              Email
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Admin email"
                className={inputStyle}
                required
              />
            </label>
            <label className="block text-sm text-white/70">
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Admin password"
                className={inputStyle}
                required
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-cyan-500 py-3 font-semibold text-black shadow-[0_0_30px_rgba(34,211,238,0.45)] transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        
        </Motion.div>
      </div>
    </div>
  );
};

const inputStyle =
  "mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/50 focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(34,211,238,0.35)]";

export default AdminLogin;
