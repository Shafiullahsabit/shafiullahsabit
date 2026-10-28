import React, { useId, useState } from "react";

const numberFormatter = new Intl.NumberFormat();
const InterestLineChart = ({ points }) => {
  const [selectedLabel, setSelectedLabel] = useState(null);
  const gradientId = `interest-chart-${useId().replaceAll(":", "")}`;
  const width = 720;
  const height = 260;
  const plot = { left: 52, right: 704, top: 20, bottom: 212 };
  const maxValue = Math.max(1, ...points.map(({ count }) => count));
  const selectedPoint =
    points.find(({ label }) => label === selectedLabel) ?? points[0];
  const chartPoints = points.map((point, index) => {
    const ratio = points.length > 1 ? index / (points.length - 1) : 0.5;
    return {
      ...point,
      x: plot.left + ratio * (plot.right - plot.left),
      y:
        plot.bottom -
        (point.count / maxValue) * (plot.bottom - plot.top),
    };
  });
  const linePoints = chartPoints.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPoints = chartPoints.length
    ? `${plot.left},${plot.bottom} ${linePoints} ${plot.right},${plot.bottom}`
    : "";
  const ticks = [...new Set([maxValue, Math.round(maxValue / 2), 0])];
  const selectNearestPoint = (clientX, svgElement) => {
    if (!chartPoints.length) return;
    const bounds = svgElement.getBoundingClientRect();
    if (bounds.width === 0) return;
    const chartX = ((clientX - bounds.left) / bounds.width) * width;
    const nearestPoint = chartPoints.reduce((nearest, point) =>
      Math.abs(point.x - chartX) < Math.abs(nearest.x - chartX)
        ? point
        : nearest,
    );
    setSelectedLabel(nearestPoint.label);
  };

  if (!selectedPoint) return null;

  return (
    <div className="min-w-0">
      <div
        className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-violet-300/20 bg-violet-300/5 px-4 py-3"
        aria-live="polite"
      >
        <span className="min-w-0 truncate text-sm text-white/60">
          {selectedPoint.label}
        </span>
        <span className="shrink-0 text-sm font-semibold text-violet-200">
          {numberFormatter.format(selectedPoint.count)}{" "}
          {selectedPoint.count === 1 ? "request" : "requests"}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-label="Project interests by request count. Select a point to inspect a project type."
        className="block h-auto min-h-[160px] w-full overflow-visible"
        onPointerDown={(event) =>
          selectNearestPoint(event.clientX, event.currentTarget)
        }
        onPointerMove={(event) => {
          if (event.pointerType === "mouse" && event.buttons === 0) {
            selectNearestPoint(event.clientX, event.currentTarget);
          }
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {ticks.map((value) => {
          const y =
            plot.bottom - (value / maxValue) * (plot.bottom - plot.top);
          return (
            <g key={value}>
              <line
                x1={plot.left}
                x2={plot.right}
                y1={y}
                y2={y}
                className="dashboard-chart-gridline"
                strokeDasharray={value === 0 ? undefined : "4 6"}
              />
              <text
                x={plot.left - 10}
                y={y + 4}
                textAnchor="end"
                className="dashboard-chart-axis-label"
              >
                {numberFormatter.format(value)}
              </text>
            </g>
          );
        })}
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <polyline
          points={linePoints}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {chartPoints.map((point) => (
          <g
            key={point.label}
            role="button"
            tabIndex={0}
            aria-label={`${point.label}: ${numberFormatter.format(point.count)} ${point.count === 1 ? "request" : "requests"}`}
            className="dashboard-chart-point cursor-pointer outline-none"
            onClick={() => setSelectedLabel(point.label)}
            onFocus={() => setSelectedLabel(point.label)}
            onMouseEnter={() => setSelectedLabel(point.label)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedLabel(point.label);
              }
            }}
          >
            <circle cx={point.x} cy={point.y} r="14" fill="transparent" />
            <circle
              cx={point.x}
              cy={point.y}
              r="4.5"
              fill="#a78bfa"
              className={`dashboard-chart-point-marker ${
                selectedPoint.label === point.label
                  ? "dashboard-chart-point-selected"
                  : ""
              }`}
            />
            <title>
              {point.label}: {numberFormatter.format(point.count)}{" "}
              {point.count === 1 ? "request" : "requests"}
            </title>
          </g>
        ))}
      </svg>
      <ul
        className="mt-1 grid gap-2 text-center text-xs text-white/55"
        style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
        aria-label="Project type labels"
      >
        {chartPoints.map((point) => (
          <li key={point.label} className="min-w-0">
            <button
              type="button"
              title={point.label}
              onClick={() => setSelectedLabel(point.label)}
              onFocus={() => setSelectedLabel(point.label)}
              className={`w-full truncate rounded-md px-1 py-1 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                selectedPoint.label === point.label ? "text-violet-200" : ""
              }`}
            >
              {point.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterestLineChart;
