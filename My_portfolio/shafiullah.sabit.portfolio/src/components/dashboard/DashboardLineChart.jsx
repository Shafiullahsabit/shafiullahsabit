import React, { useId, useState } from "react";

const numberFormatter = new Intl.NumberFormat();
const detailDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const formatDate = (date, formatter) =>
  formatter.format(new Date(`${date}T00:00:00`));

const DashboardLineChart = ({ title, points, color, valueLabel }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const gradientId = `dashboard-chart-${useId().replaceAll(":", "")}`;
  const width = 720;
  const height = 260;
  const plot = { left: 54, right: 708, top: 18, bottom: 214 };
  const maxValue = Math.max(1, ...points.map((point) => point.value));
  const selectedPoint =
    points.find((point) => point.date === selectedDate) ?? points.at(-1);
  const chartPoints = points.map((point, index) => {
    const ratio = points.length > 1 ? index / (points.length - 1) : 0.5;
    return {
      ...point,
      x: plot.left + ratio * (plot.right - plot.left),
      y:
        plot.bottom -
        (point.value / maxValue) * (plot.bottom - plot.top),
    };
  });
  const linePoints = chartPoints.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPoints = chartPoints.length
    ? `${plot.left},${plot.bottom} ${linePoints} ${plot.right},${plot.bottom}`
    : "";
  const dateIndexes = [
    ...new Set(
      [0, Math.floor((points.length - 1) / 3), Math.floor((points.length - 1) * 2 / 3), points.length - 1]
        .filter((index) => index >= 0),
    ),
  ];
  const valueTicks = [
    ...new Set([maxValue, Math.round(maxValue / 2), 0]),
  ];
  const selectNearestPoint = (clientX, svgElement) => {
    if (!chartPoints.length) return;
    const bounds = svgElement.getBoundingClientRect();
    const chartX = ((clientX - bounds.left) / bounds.width) * width;
    const nearestPoint = chartPoints.reduce((nearest, point) =>
      Math.abs(point.x - chartX) < Math.abs(nearest.x - chartX)
        ? point
        : nearest,
    );
    setSelectedDate(nearestPoint.date);
  };

  return (
    <div className="min-w-0">
      {selectedPoint && (
        <div
          className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3"
          aria-live="polite"
        >
          <span className="text-sm text-white/60">
            {formatDate(selectedPoint.date, detailDateFormatter)}
          </span>
          <span className="text-sm font-semibold text-cyan-200">
            {numberFormatter.format(selectedPoint.value)} {valueLabel}
          </span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-label={`${title}. Select a point to inspect its date and value.`}
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
            <stop offset="0%" stopColor={color} stopOpacity="0.24" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {valueTicks.map((value) => {
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
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {chartPoints.map((point) => (
          <g
            key={point.date}
            role="button"
            tabIndex={0}
            aria-label={`${formatDate(point.date, detailDateFormatter)}: ${numberFormatter.format(point.value)} ${valueLabel}`}
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
            <circle cx={point.x} cy={point.y} r="12" fill="transparent" />
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
              {formatDate(point.date, detailDateFormatter)}:{" "}
              {numberFormatter.format(point.value)} {valueLabel}
            </title>
          </g>
        ))}

        {dateIndexes.map((index) => {
          const point = chartPoints[index];
          return (
            <text
              key={point.date}
              x={point.x}
              y={height - 12}
              textAnchor={
                index === 0
                  ? "start"
                  : index === chartPoints.length - 1
                    ? "end"
                    : "middle"
              }
              className="dashboard-chart-axis-label"
            >
              {formatDate(point.date, shortDateFormatter)}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default DashboardLineChart;
