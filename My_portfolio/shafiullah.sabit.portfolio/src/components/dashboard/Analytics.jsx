import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaChartLine,
  FaEnvelope,
  FaEnvelopeOpen,
  FaEye,
  FaPercentage,
  FaSyncAlt,
} from "react-icons/fa";
import { getContactMessageError } from "../../lib/contactMessageErrors";
import { supabase } from "../../lib/supabase";
import StatCard from "./StatCard";

const numberFormatter = new Intl.NumberFormat();
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});
const detailDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const rangeOptions = [7, 30];

const getDateKey = (date) => date.toISOString().slice(0, 10);
const formatDate = (date) => dateFormatter.format(new Date(`${date}T00:00:00`));
const formatDetailDate = (date) =>
  detailDateFormatter.format(new Date(`${date}T00:00:00`));

const createDailySeries = (days, startDate, rows, valueForRow) => {
  const totalsByDate = new Map();
  rows.forEach((row) => {
    const date = getDateKey(new Date(row.created_at));
    totalsByDate.set(date, (totalsByDate.get(date) ?? 0) + valueForRow(row));
  });

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + index);
    const key = getDateKey(date);
    return { date: key, value: totalsByDate.get(key) ?? 0 };
  });
};

const TrendChart = ({
  title,
  description,
  color,
  points,
  emptyMessage,
  isLoading,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const width = 720;
  const height = 220;
  const padding = 12;
  const maxValue = Math.max(1, ...points.map((point) => point.value));
  const chartPoints = points.map((point, index) => ({
    ...point,
    x: points.length > 1 ? (index / (points.length - 1)) * width : width / 2,
    y:
      height -
      padding -
      (point.value / maxValue) * (height - padding * 2),
  }));
  const linePoints = chartPoints.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPoints = chartPoints.length
    ? `0,${height} ${linePoints} ${width},${height}`
    : "";
  const labelIndexes = [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])];
  const selectedPoint =
    points.find((point) => point.date === selectedDate) ?? points.at(-1);

  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_35px_rgba(0,255,255,0.04)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/45">{description}</p>
        </div>
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      </div>

      {isLoading ? (
        <div
          className="mt-6 h-56 animate-pulse rounded-xl bg-white/5"
          aria-label={`Loading ${title.toLowerCase()} chart`}
        />
      ) : points.length === 0 ? (
        <p className="mt-6 rounded-xl border border-white/10 bg-black/20 p-6 text-center text-sm text-white/55">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-5">
          {selectedPoint && (
            <div
              className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3"
              aria-live="polite"
            >
              <span className="text-sm text-white/60">
                {formatDetailDate(selectedPoint.date)}
              </span>
              <span className="text-sm font-semibold text-cyan-200">
                {numberFormatter.format(selectedPoint.value)}{" "}
                {title === "Page views" ? "page views" : "messages"}
              </span>
            </div>
          )}
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              role="group"
              aria-label={`${title} trend. Select a point to inspect its date and value.`}
              className="h-56 min-w-[460px] w-full overflow-visible"
            >
              <defs>
                <linearGradient
                  id={`gradient-${title.replace(/\s+/g, "-").toLowerCase()}`}
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = height - padding - ratio * (height - padding * 2);
                return (
                  <line
                    key={ratio}
                    x1="0"
                    x2={width}
                    y1={y}
                    y2={y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 6"
                  />
                );
              })}
              <polygon
                points={areaPoints}
                fill={`url(#gradient-${title.replace(/\s+/g, "-").toLowerCase()})`}
              />
              <polyline
                points={linePoints}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {chartPoints.map((point) => (
                <g
                  key={point.date}
                  role="button"
                  tabIndex={0}
                  aria-label={`${formatDetailDate(point.date)}: ${numberFormatter.format(point.value)} ${title === "Page views" ? "page views" : "messages"}`}
                  className="dashboard-chart-point cursor-pointer outline-none"
                  onClick={() => setSelectedDate(point.date)}
                  onFocus={() => setSelectedDate(point.date)}
                  onMouseEnter={() => setSelectedDate(point.date)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedDate(point.date);
                    }
                  }}
                >
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="12"
                    fill="transparent"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill={color}
                    className={`dashboard-chart-point-marker ${
                      selectedPoint?.date === point.date
                        ? "dashboard-chart-point-selected"
                        : ""
                    }`}
                  />
                  <title>
                    {formatDetailDate(point.date)}:{" "}
                    {numberFormatter.format(point.value)}{" "}
                    {title === "Page views" ? "page views" : "messages"}
                  </title>
                </g>
              ))}
            </svg>
          </div>
          <div className="mt-2 flex justify-between text-xs text-white/40">
            {labelIndexes.map((index) => (
              <span key={points[index].date}>{formatDate(points[index].date)}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

const Analytics = ({ onNavigate }) => {
  const [range, setRange] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [pageViews, setPageViews] = useState({ status: "loading", points: [], error: "" });
  const [messages, setMessages] = useState({
    status: "loading",
    points: [],
    total: 0,
    unread: 0,
    types: [],
    error: "",
  });
  const requestId = useRef(0);

  const loadAnalytics = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setPageViews((current) => ({ ...current, status: "loading", error: "" }));
    setMessages((current) => ({ ...current, status: "loading", error: "" }));

    const today = new Date();
    const endDate = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
    );
    const startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - range + 1);
    const nextDate = new Date(endDate);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);

    try {
      if (!supabase) throw new Error("Supabase is not configured.");
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error("Sign in again to view dashboard analytics.");

      const [viewsResult, totalResult, unreadResult, periodResult] =
        await Promise.allSettled([
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
          supabase
            .from("contact_messages")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("contact_messages")
            .select("id", { count: "exact", head: true })
            .eq("is_read", false),
          supabase
            .from("contact_messages")
            .select("created_at, is_read, project_type")
            .gte("created_at", startDate.toISOString())
            .lt("created_at", nextDate.toISOString()),
        ]);

      if (requestId.current !== currentRequestId) return;

      if (viewsResult.status === "fulfilled") {
        const points = Array.isArray(viewsResult.value.points)
          ? viewsResult.value.points.slice(-range).map((point) => ({
              date: point.date,
              value: point.pageViews,
            }))
          : [];
        setPageViews({ status: "ready", points, error: "" });
      } else {
        setPageViews({
          status:
            viewsResult.reason?.code === "ANALYTICS_NOT_CONFIGURED"
              ? "unconfigured"
              : "error",
          points: [],
          error: viewsResult.reason?.message || "Unable to load page views.",
        });
      }

      const contactError = [
        totalResult,
        unreadResult,
        periodResult,
      ].find((result) => result.status === "rejected")?.reason;
      if (
        totalResult.status === "fulfilled" &&
        unreadResult.status === "fulfilled" &&
        periodResult.status === "fulfilled"
      ) {
        const queryError =
          totalResult.value.error ||
          unreadResult.value.error ||
          periodResult.value.error;
        if (queryError) throw queryError;

        const rows = periodResult.value.data ?? [];
        const typeCounts = new Map();
        rows.forEach(({ project_type }) => {
          const label = project_type?.trim() || "Not specified";
          typeCounts.set(label, (typeCounts.get(label) ?? 0) + 1);
        });
        const types = [...typeCounts.entries()]
          .map(([label, count]) => ({ label, count }))
          .sort((left, right) => right.count - left.count)
          .slice(0, 5);

        setMessages({
          status: "ready",
          points: createDailySeries(range, startDate, rows, () => 1),
          total: totalResult.value.count ?? 0,
          unread: unreadResult.value.count ?? 0,
          types,
          error: "",
        });
      } else {
        throw contactError || new Error("Unable to load message analytics.");
      }
    } catch (error) {
      if (requestId.current !== currentRequestId) return;
      console.error("Unable to load dashboard analytics:", error);
      setMessages((current) => ({
        ...current,
        status: "error",
        error: getContactMessageError(
          error,
          "Could not load contact analytics. Check your connection and try again.",
        ),
      }));
      setPageViews((current) =>
        current.status === "loading"
          ? {
              status: "error",
              points: [],
              error: error.message || "Unable to load page views.",
            }
          : current,
      );
    } finally {
      if (requestId.current === currentRequestId) setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    loadAnalytics();
    return () => {
      requestId.current += 1;
    };
  }, [loadAnalytics]);

  const messageTotalForRange = useMemo(
    () => messages.points.reduce((total, point) => total + point.value, 0),
    [messages.points],
  );
  const readRate =
    messages.total > 0
      ? Math.round(((messages.total - messages.unread) / messages.total) * 100)
      : 0;
  const pageViewTotal = pageViews.points.reduce(
    (total, point) => total + point.value,
    0,
  );
  const maxTypeCount = Math.max(1, ...messages.types.map((type) => type.count));

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Analytics
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Track portfolio traffic and contact activity in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex rounded-xl border border-white/10 bg-white/5 p-1"
            aria-label="Analytics date range"
          >
            {rangeOptions.map((days) => (
              <button
                key={days}
                type="button"
                aria-pressed={range === days}
                onClick={() => setRange(days)}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  range === days
                    ? "bg-cyan-400 text-slate-950"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {days} days
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={loadAnalytics}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaSyncAlt className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={`Page views · ${range} days`}
          value={pageViews.status === "ready" ? numberFormatter.format(pageViewTotal) : "—"}
          description="Tracked by Vercel Web Analytics"
          icon={FaEye}
          isLoading={isLoading}
        />
        <StatCard
          title={`Messages · ${range} days`}
          value={messages.status === "ready" ? numberFormatter.format(messageTotalForRange) : "—"}
          description="New contact submissions"
          icon={FaEnvelope}
          isLoading={isLoading}
        />
        <StatCard
          title="Unread messages"
          value={messages.status === "ready" ? numberFormatter.format(messages.unread) : "—"}
          description="Across your full inbox"
          icon={FaEnvelopeOpen}
          isLoading={isLoading}
        />
        <StatCard
          title="Inbox read rate"
          value={messages.status === "ready" ? `${readRate}%` : "—"}
          description={`${numberFormatter.format(messages.total)} messages in total`}
          icon={FaPercentage}
          isLoading={isLoading}
        />
      </div>

      {pageViews.status === "unconfigured" && (
        <p className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100/80">
          Page-view analytics is not configured. Add the
          <code className="mx-1">VERCEL_ANALYTICS_API_TOKEN</code>
          secret in Vercel to enable this chart.
        </p>
      )}

      {pageViews.status === "error" && (
        <div role="alert" className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200">
          Page views: {pageViews.error}
        </div>
      )}
      {messages.status === "error" && (
        <div role="alert" className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200">
          Contact data: {messages.error}
        </div>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        <TrendChart
          title="Page views"
          description={`Daily visits over the last ${range} days`}
          color="#22d3ee"
          points={pageViews.points}
          emptyMessage="No Vercel page-view data is available for this period yet."
          isLoading={pageViews.status === "loading"}
        />
        <TrendChart
          title="Contact messages"
          description={`Daily submissions over the last ${range} days`}
          color="#a78bfa"
          points={messages.points}
          emptyMessage="No contact messages were received during this period."
          isLoading={messages.status === "loading"}
        />
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_35px_rgba(0,255,255,0.04)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Message interests</h3>
            <p className="mt-1 text-sm text-white/45">
              Most selected project types · last {range} days
            </p>
          </div>
          <FaChartLine className="text-violet-300" aria-hidden="true" />
        </div>
        {messages.status === "loading" ? (
          <div className="mt-5 h-32 animate-pulse rounded-xl bg-white/5" />
        ) : messages.types.length === 0 ? (
          <p className="mt-5 rounded-xl border border-white/10 bg-black/20 p-5 text-center text-sm text-white/55">
            No project interests to show for this period.
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {messages.types.map((type) => (
              <li key={type.label}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-white/75">{type.label}</span>
                  <span className="shrink-0 text-white/45">
                    {numberFormatter.format(type.count)}
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-label={`${type.label} message count`}
                  aria-valuemin={0}
                  aria-valuemax={maxTypeCount}
                  aria-valuenow={type.count}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"
                    style={{ width: `${(type.count / maxTypeCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => onNavigate("contacts")}
          className="mt-5 rounded-lg text-sm font-medium text-cyan-300 transition hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          Open contact inbox →
        </button>
      </section>
    </section>
  );
};

export default Analytics;
