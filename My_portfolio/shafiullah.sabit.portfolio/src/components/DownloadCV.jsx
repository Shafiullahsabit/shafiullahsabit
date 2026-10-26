import React, { useState } from "react";
import cvFile from "../CV/shafiullahsabit.pdf";

// Snackbar component (UNCHANGED)
const Snackbar = ({ message, onClose }) => (
  <div
    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
    style={{ zIndex: 9999 }}
  >
    <span>{message}</span>
    <button
      onClick={onClose}
      className="ml-4 text-white font-semibold hover:text-gray-300"
    >
      X
    </button>
  </div>
);

const Navbar = () => {
  const [downloaded, setDownloaded] = useState(
    () => localStorage.getItem("cvDownloaded") === "true",
  );
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleDownloadCV = () => {
    const isDownloaded = localStorage.getItem("cvDownloaded");

    // ✅ ONLY change: show snackbar instead of alert
    if (isDownloaded) {
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000);
      return;
    }

    const link = document.createElement("a");
    link.href = cvFile;
    link.download = "shafiullahsabit.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    localStorage.setItem("cvDownloaded", "true");
    setDownloaded(true);

    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  return (
    <div>
      <button
        onClick={handleDownloadCV}
        disabled={downloaded}
        className={`px-4 py-2 rounded-lg text-white font-semibold ${
          downloaded
            ? "border-2 border-gray-500 bg-gray-400 cursor-not-allowed"
            : "border-2 border-blue-500 bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {downloaded ? "CV Downloaded" : "Download CV"}
      </button>

      {showSnackbar && (
        <Snackbar
          message="You have already downloaded the CV."
          onClose={() => setShowSnackbar(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
