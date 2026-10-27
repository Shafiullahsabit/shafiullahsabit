import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Particles from "./components/Particles.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Footer from "./components/Footer";
import Skills from "./components/Skills.jsx";
import Projects from "./components/project.jsx";
import Contact from "./components/Contact";
import Services from "./components/Services.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MouseEffect from "./components/MouseEffect.jsx";

function Portfolio() {
  useEffect(() => {
    const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    if (!domain) return undefined;

    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://plausible.io/js/script.js";
    script.dataset.domain = domain;
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <Navbar />

      <div className="relative flex min-h-screen w-full items-center justify-center">
        <div className="relative z-10 w-full">
          <Home />
        </div>
      </div>

      <About />
      <Skills />
      <Projects />
      <Services />
      <Contact />
      <Footer />
      <MouseEffect />
      <Analytics />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default App;
