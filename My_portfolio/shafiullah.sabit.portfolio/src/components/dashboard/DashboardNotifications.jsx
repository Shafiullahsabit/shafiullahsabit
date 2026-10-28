import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChartLine, FaEnvelope } from "react-icons/fa";
import { supabase } from "../../lib/supabase";

const REFRESH_INTERVAL = 60_000;

const initialMetric = { status: "loading", value: null, error: "" };

const formatCount = (value) =>
  new Intl.NumberFormat().format(value);

const DashboardNotifications = ({ onNavigate }) => {
  const [unreadMessages, setUnreadMessages] = useState(initialMetric);
  const [pageViews, setPageViews] = useState(initialMetric);
  const requestId = useRef(0);

  const loadNotifications = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    setUnreadMessages((current) => ({ ...current, status: "loading", error: "" }));
    setPageViews((current) => ({ ...current, status: "loading", error: "" }));

    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error("Sign in again to view dashboard notifications.");

      const [messagesResult, viewsResult] = await Promise.allSettled([
        supabase
          .from("contact_messages")
          .select("id", { count: "exact", head: true })
          .eq("is_read", false),
        fetch("/api/analytics", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }).then(async (response) => {
          const result = await response.json();
          if (!response.ok) {
            const error = new Error(
              result.message || "Unable to load page-view analytics.",
            );
            error.code = result.code;
            throw error;
          }
          return result;
        }),
      ]);

      if (requestId.current !== currentRequestId) return;

      if (
        messagesResult.status === "fulfilled" &&
        !messagesResult.value.error &&
        Number.isFinite(messagesResult.value.count)
      ) {
        setUnreadMessages({
          status: "ready",
          value: messagesResult.value.count,
          error: "",
        });
      } else {
        const error =
          messagesResult.status === "rejected"
            ? messagesResult.reason
            : messagesResult.value.error ||
              new Error("Unable to load unread contact messages.");
        console.error("Unable to load unread message notifications:", error);
        setUnreadMessages({
          status: "error",
          value: null,
          error: error.message || "Unable to load unread messages.",
        });
      }

      if (
        viewsResult.status === "fulfilled" &&
        Number.isFinite(viewsResult.value.pageViews)
      ) {
        setPageViews({
          status: "ready",
          value: viewsResult.value.pageViews,
          error: "",
        });
      } else {
        const error =
          viewsResult.status === "rejected"
            ? viewsResult.reason
            : new Error("Vercel returned invalid page-view data.");
        console.error("Unable to load page-view notifications:", error);
        setPageViews({
          status: "error",
          value: null,
          error: error.message || "Unable to load page views.",
        });
      }
    } catch (error) {
      if (requestId.current !== currentRequestId) return;
      console.error("Unable to load dashboard notifications:", error);
      const message = error.message || "Unable to load dashboard notifications.";
      setUnreadMessages({ status: "error", value: null, error: message });
      setPageViews({ status: "error", value: null, error: message });
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, REFRESH_INTERVAL);
    window.addEventListener("focus", loadNotifications);

    return () => {
      requestId.current += 1;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", loadNotifications);
    };
  }, [loadNotifications]);

  const getNotificationLabel = (metric, label, range = "") => {
    if (metric.status === "loading") return `${label}: loading`;
    if (metric.status === "error") return `${label}: unavailable. ${metric.error}`;
    return `${label}: ${formatCount(metric.value)}${range}`;
  };

  const renderBadge = (metric) => {
    if (metric.status === "loading") {
      return (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-white/40"
        />
      );
    }
    if (metric.status === "error") {
      return (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-black"
        >
          !
        </span>
      );
    }
    if (metric.value === 0) return null;
    return (
      <span
        aria-hidden="true"
        className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-400 px-1 text-[9px] font-bold leading-none text-slate-950"
      >
        {metric.value > 99 ? "99+" : formatCount(metric.value)}
      </span>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onNavigate("contacts")}
        aria-label={getNotificationLabel(unreadMessages, "Unread messages")}
        title={getNotificationLabel(unreadMessages, "Unread messages")}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/75 transition hover:border-cyan-400/40 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <FaEnvelope aria-hidden="true" />
        {renderBadge(unreadMessages)}
      </button>
      <button
        type="button"
        onClick={() => onNavigate("analytics")}
        aria-label={getNotificationLabel(pageViews, "Page views", " in the last 30 days")}
        title={getNotificationLabel(pageViews, "Page views", " in the last 30 days")}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/75 transition hover:border-cyan-400/40 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <FaChartLine aria-hidden="true" />
        {renderBadge(pageViews)}
      </button>
    </div>
  );
};

export default DashboardNotifications;
