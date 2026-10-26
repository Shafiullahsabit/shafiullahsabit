import React, { useCallback, useEffect, useState } from "react";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaEye,
  FaGlobe,
  FaSyncAlt,
  FaUserCog,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { getContactMessageError } from "../../lib/contactMessageErrors";
import { supabase } from "../../lib/supabase";
import { portfolioProjects } from "../../data/portfolioProjects";
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
  const [messageStats, setMessageStats] = useState({
    total: 0,
    unread: 0,
    recent: [],
  });
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messageError, setMessageError] = useState("");
  const [analytics, setAnalytics] = useState({
    status: import.meta.env.VITE_PLAUSIBLE_DOMAIN ? "loading" : "unconfigured",
    pageViews: null,
    points: [],
    error: "",
  });

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
    if (!import.meta.env.VITE_PLAUSIBLE_DOMAIN) {
      setAnalytics({
        status: "unconfigured",
        pageViews: null,
        points: [],
        error: "",
      });
      return;
    }

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
      console.error("Unable to load Plausible analytics:", error);
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

  const chartWidth = 720;
  const chartHeight = 220;
  const chartPadding = 12;
  const maxPageViews = Math.max(
    1,
    ...analytics.points.map((point) => point.pageViews),
  );
  const chartPoints = analytics.points.map((point, index) => {
    const x =
      analytics.points.length > 1
        ? (index / (analytics.points.length - 1)) * chartWidth
        : chartWidth / 2;
    const y =
      chartHeight -
      chartPadding -
      (point.pageViews / maxPageViews) * (chartHeight - chartPadding * 2);
    return { ...point, x, y };
  });
  const linePoints = chartPoints.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPoints = chartPoints.length
    ? `0,${chartHeight} ${linePoints} ${chartWidth},${chartHeight}`
    : "";
  const labelIndexes = [0, 7, 14, 21, 29].filter(
    (index) => index < analytics.points.length,
  );

  return (
    <section className="space-y-6">
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
          description="Last 30 days · Plausible Analytics"
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
              Analytics isn’t configured yet, so page-view totals are not
              available. Add the Plausible settings listed in the project
              README and redeploy to enable tracking and this chart.
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
              Plausible is connected, but no page-view data is available for
              this period yet.
            </p>
          ) : (
            <div className="mt-6">
              <div className="overflow-x-auto">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  role="img"
                  aria-label="Daily page views over the last 30 days"
                  className="h-56 min-w-[520px] w-full overflow-visible"
                >
                  {[0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y =
                      chartHeight -
                      chartPadding -
                      ratio * (chartHeight - chartPadding * 2);
                    return (
                      <line
                        key={ratio}
                        x1="0"
                        x2={chartWidth}
                        y1={y}
                        y2={y}
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="4 6"
                      />
                    );
                  })}
                  <polygon
                    points={areaPoints}
                    fill="url(#page-view-gradient)"
                  />
                  <defs>
                    <linearGradient
                      id="page-view-gradient"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#22d3ee"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="#22d3ee"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <polyline
                    points={linePoints}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {chartPoints.map((point) => (
                    <circle
                      key={point.date}
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill="#22d3ee"
                    >
                      <title>
                        {point.date}: {numberFormatter.format(point.pageViews)}{" "}
                        views
                      </title>
                    </circle>
                  ))}
                </svg>
              </div>
              <div className="mt-2 flex justify-between text-xs text-white/40">
                {labelIndexes.map((index) => (
                  <span key={analytics.points[index].date}>
                    {formatDate(analytics.points[index].date)}
                  </span>
                ))}
              </div>
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
            onClick={() => onNavigate("contacts")}
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
          <Link
            to="/#projects"
            className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
          >
            <span className="flex items-center gap-3 font-semibold text-white">
              <FaGlobe className="text-cyan-300" />
              Manage projects
            </span>
            <span className="mt-2 block text-xs text-white/45">
              Review projects shown on the portfolio
            </span>
          </Link>
          <a
            href="https://supabase.com/dashboard/project/ntjvttezfbmmfimzphhb/auth/users"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
          >
            <span className="flex items-center gap-3 font-semibold text-white">
              <FaUserCog className="text-cyan-300" />
              Profile settings
            </span>
            <span className="mt-2 block text-xs text-white/45">
              Manage the administrator account
            </span>
          </a>
          <Link
            to="/"
            className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/30 hover:bg-white/[0.08]"
          >
            <span className="flex items-center gap-3 font-semibold text-white">
              <FaEye className="text-cyan-300" />
              View public portfolio
            </span>
            <span className="mt-2 block text-xs text-white/45">
              Open the live portfolio page
            </span>
          </Link>
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
