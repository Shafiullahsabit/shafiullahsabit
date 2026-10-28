import React, { useCallback, useEffect, useState } from "react";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaEye,
  FaGlobe,
  FaSyncAlt,
  FaUserCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getContactMessageError } from "../../lib/contactMessageErrors";
import { supabase } from "../../lib/supabase";
import { portfolioProjects } from "../../data/portfolioProjects";
import DashboardLineChart from "./DashboardLineChart";
import ConfirmDialog from "./ConfirmDialog";
import StatCard from "./StatCard";

const numberFormatter = new Intl.NumberFormat();
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : dateFormatter.format(date);
};

const Overview = ({ onNavigate }) => {
  const [quickAction, setQuickAction] = useState(null);
  const navigate = useNavigate();
  const [messageStats, setMessageStats] = useState({
    total: 0,
    unread: 0,
    recent: [],
  });
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messageError, setMessageError] = useState("");
  const [analytics, setAnalytics] = useState({
    status: "loading",
    pageViews: null,
    points: [],
    error: "",
  });

  const confirmQuickAction = () => {
    if (!quickAction) return;

    switch (quickAction) {
      case "messages":
        setQuickAction(null);
        onNavigate("contacts");
        break;
      case "projects":
      case "portfolio":
        setQuickAction(null);
        navigate(quickAction === "projects" ? "/#projects" : "/");
        break;
      case "profile":
        setQuickAction(null);
        window.open(
          "https://supabase.com/dashboard/project/ntjvttezfbmmfimzphhb/auth/users",
          "_blank",
          "noopener,noreferrer",
        );
        break;
      default:
        setQuickAction(null);
    }
  };

  const loadMessages = useCallback(async () => {
    if (!supabase) {
      setMessageError("Supabase is not configured.");
      setIsLoadingMessages(false);
      return;
    }

    setIsLoadingMessages(true);
    setMessageError("");

    try {
      const [totalResult, unreadResult, recentResult] = await Promise.all([
        supabase
          .from("contact_messages")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("contact_messages")
          .select("id", { count: "exact", head: true })
          .eq("is_read", false),
        supabase
          .from("contact_messages")
          .select("id, first_name, last_name, email, is_read, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const queryError =
        totalResult.error || unreadResult.error || recentResult.error;
      if (queryError) throw queryError;

      setMessageStats({
        total: totalResult.count ?? 0,
        unread: unreadResult.count ?? 0,
        recent: recentResult.data ?? [],
      });
    } catch (error) {
      console.error("Unable to load overview contact messages:", error);
      setMessageError(
        getContactMessageError(
          error,
          "Could not load message statistics. Check your connection and try again.",
        ),
      );
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    setAnalytics((current) => ({ ...current, status: "loading", error: "" }));
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        throw new Error("Sign in again to view dashboard analytics.");
      }

      const response = await fetch("/api/analytics", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.code === "ANALYTICS_NOT_CONFIGURED") {
          setAnalytics({
            status: "unconfigured",
            pageViews: null,
            points: [],
            error: "",
          });
          return;
        }
        throw new Error(result.message || "Unable to load page-view analytics.");
      }

      setAnalytics({
        status: "ready",
        pageViews: result.pageViews,
        points: result.points,
        error: "",
      });
    } catch (error) {
      console.error("Unable to load Vercel analytics:", error);
      setAnalytics({
        status: "error",
        pageViews: null,
        points: [],
        error: error.message || "Unable to load analytics.",
      });
    }
  }, []);

  useEffect(() => {
    loadMessages();
    loadAnalytics();
  }, [loadAnalytics, loadMessages]);

  return (
    <section className="space-y-6">
      {quickAction && (
        <ConfirmDialog
          variant="primary"
          title={
            quickAction === "messages"
              ? "Open your contact inbox?"
              : quickAction === "projects"
                ? "Leave the dashboard to review projects?"
                : quickAction === "profile"
                  ? "Open Supabase profile settings?"
                  : "Leave the dashboard to view your portfolio?"
          }
          description={
            quickAction === "messages"
              ? "You will stay in the dashboard and switch to Contact messages."
              : quickAction === "profile"
                ? "Supabase profile settings will open in a new browser tab."
                : "This will take you away from the dashboard."
          }
          confirmLabel={
            quickAction === "messages"
              ? "Open inbox"
              : quickAction === "profile"
                ? "Continue to Supabase"
                : "Leave dashboard"
          }
          onCancel={() => setQuickAction(null)}
          onConfirm={confirmQuickAction}
        />
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Dashboard overview
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Live message data and portfolio performance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            loadMessages();
            loadAnalytics();
          }}
          disabled={isLoadingMessages || analytics.status === "loading"}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaSyncAlt
            className={
              isLoadingMessages || analytics.status === "loading"
                ? "animate-spin"
                : ""
            }
          />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Messages"
          value={numberFormatter.format(messageStats.total)}
          description="All contact messages"
          icon={FaEnvelope}
          isLoading={isLoadingMessages}
        />
        <StatCard
          title="Unread Messages"
          value={numberFormatter.format(messageStats.unread)}
          description="Waiting for your reply"
          icon={FaEnvelopeOpen}
          isLoading={isLoadingMessages}
        />
        <StatCard
          title="Portfolio Projects"
          value={numberFormatter.format(portfolioProjects.length)}
          description="Projects currently displayed"
          icon={FaGlobe}
        />
        <StatCard
          title="Page Views"
          value={
            analytics.status === "ready"
              ? numberFormatter.format(analytics.pageViews)
              : "—"
          }
          description="Last 30 days · Vercel Analytics"
          icon={FaEye}
          isLoading={analytics.status === "loading"}
        />
      </div>

      {messageError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200"
        >
          <span>{messageError}</span>
          <button
            type="button"
            onClick={loadMessages}
            className="underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
        <section className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_35px_rgba(0,255,255,0.04)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Page views</h3>
              <p className="mt-1 text-sm text-white/45">
                Daily views over the last 30 days
              </p>
            </div>
            {analytics.status === "ready" && (
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                {numberFormatter.format(analytics.pageViews)} total
              </span>
            )}
          </div>

          {analytics.status === "loading" ? (
            <div className="mt-6 h-56 animate-pulse rounded-xl bg-white/5" />
          ) : analytics.status === "unconfigured" ? (
            <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-relaxed text-amber-100/80">
              Add a project-scoped Vercel API token as the sensitive
              <code className="mx-1">VERCEL_ANALYTICS_API_TOKEN</code>
              environment variable in Vercel, then redeploy to load this chart.
            </div>
          ) : analytics.status === "error" ? (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200"
            >
              {analytics.error}
              <button
                type="button"
                onClick={loadAnalytics}
                className="ml-2 underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          ) : analytics.points.length === 0 ? (
            <p className="mt-6 rounded-xl border border-white/10 bg-black/20 p-6 text-center text-sm text-white/55">
              No Vercel page-view data is available for this period yet.
            </p>
          ) : (
            <div className="mt-6">
              <DashboardLineChart
                title="Daily page views"
                points={analytics.points.map((point) => ({
                  date: point.date,
                  value: point.pageViews,
                }))}
                color="#22d3ee"
                valueLabel="page views"
              />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_35px_rgba(0,255,255,0.04)] backdrop-blur-xl sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Recent messages
              </h3>
              <p className="mt-1 text-sm text-white/45">
                The five latest contact submissions
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("contacts")}
              className="shrink-0 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              View all
            </button>
          </div>

          {isLoadingMessages ? (
            <div className="mt-5 space-y-3" aria-label="Loading messages">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-[72px] animate-pulse rounded-xl bg-white/5"
                />
              ))}
            </div>
          ) : messageError ? (
            <p className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">
              Recent messages are unavailable until the message query succeeds.
            </p>
          ) : messageStats.recent.length === 0 ? (
            <p className="mt-5 rounded-xl border border-white/10 bg-black/20 p-5 text-center text-sm text-white/55">
              No contact messages yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-white/10">
              {messageStats.recent.map((message) => (
                <li key={message.id} className="flex min-w-0 gap-3 py-3">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      message.is_read ? "bg-white/20" : "bg-cyan-400"
                    }`}
                    aria-label={message.is_read ? "Read" : "Unread"}
                    title={message.is_read ? "Read" : "Unread"}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                      <p className="truncate text-sm font-medium text-white">
                        {message.first_name} {message.last_name}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          message.is_read
                            ? "bg-white/10 text-white/50"
                            : "bg-cyan-400/10 text-cyan-200"
                        }`}
                      >
                        {message.is_read ? "Read" : "Unread"}
                      </span>
                    </div>
                    <a
                      href={`mailto:${message.email}`}
                      className="mt-0.5 block truncate text-xs text-cyan-200/70 hover:text-cyan-200"
                    >
                      {message.email}
                    </a>
                    <p className="mt-1 text-[11px] text-white/40">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section>
        <h3 className="mb-3 text-lg font-semibold text-white">Quick actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => setQuickAction("messages")}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
          >
            <span className="flex items-center gap-3 font-semibold text-white">
              <FaEnvelopeOpen className="text-cyan-300" />
              Manage messages
            </span>
            <span className="mt-2 block text-xs text-white/45">
              Open the contact inbox
            </span>
          </button>
          <button
            type="button"
            onClick={() => setQuickAction("projects")}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
          >
            <span className="flex items-center gap-3 font-semibold text-white">
              <FaGlobe className="text-cyan-300" />
              Manage projects
            </span>
            <span className="mt-2 block text-xs text-white/45">
              Review projects shown on the portfolio
            </span>
          </button>
          <button
            type="button"
            onClick={() => setQuickAction("profile")}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
          >
            <span className="flex items-center gap-3 font-semibold text-white">
              <FaUserCog className="text-cyan-300" />
              Profile settings
            </span>
            <span className="mt-2 block text-xs text-white/45">
              Manage the administrator account
            </span>
          </button>
          <button
            type="button"
            onClick={() => setQuickAction("portfolio")}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
          >
            <span className="flex items-center gap-3 font-semibold text-white">
              <FaEye className="text-cyan-300" />
              View public portfolio
            </span>
            <span className="mt-2 block text-xs text-white/45">
              Open the live portfolio page
            </span>
          </button>
        </div>
        <p className="mt-3 text-xs text-white/35">
          Project content is currently maintained in the portfolio source; no
          project editor is configured in this dashboard.
        </p>
      </section>
    </section>
  );
};

export default Overview;
