import React, { useEffect, useRef } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ConfirmDialog = ({
  title,
  description,
  confirmLabel,
  isConfirming = false,
  variant = "danger",
  onCancel,
  onConfirm,
}) => {
  const cancelButtonRef = useRef(null);
  const isPrimary = variant === "primary";

  useEffect(() => {
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isConfirming) onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isConfirming, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isConfirming) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#070a10] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.65)]"
      >
        <div className="flex gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
              isPrimary
                ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                : "border-red-400/20 bg-red-400/10 text-red-300"
            }`}
          >
            <FaExclamationTriangle aria-hidden="true" />
          </span>
          <div>
            <h2
              id="confirm-dialog-title"
              className="text-lg font-semibold text-white"
            >
              {title}
            </h2>
            <p
              id="confirm-dialog-description"
              className="mt-2 text-sm leading-relaxed text-white/60"
            >
              {description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`rounded-xl border px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isPrimary
                ? "border-cyan-400/30 bg-cyan-600 hover:bg-cyan-500"
                : "border-red-400/30 bg-red-500/90 hover:bg-red-500"
            }`}
          >
            {isConfirming ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmDialog;
