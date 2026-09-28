import React, { useState } from 'react';

// --- Line Chart: Weekly GPA ---
export interface LineChartPoint {
  week: string;
  gpa: number;
  target?: number;
}

export const WeeklyGpaLineChart: React.FC<{ data: LineChartPoint[] }> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const minVal = 6.0;
  const maxVal = 9.0;
  const height = 180;
  const paddingX = 35;
  const paddingY = 25;
  const width = 500;

  const getX = (index: number) => {
    return paddingX + (index * (width - paddingX * 2)) / (data.length - 1);
  };

  const getY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    return height - paddingY - ratio * (height - paddingY * 2);
  };

  const pointsStr = data.map((d, i) => `${getX(i)},${getY(d.gpa)}`).join(' ');
  const areaPointsStr = `${getX(0)},${height - paddingY} ${pointsStr} ${getX(data.length - 1)},${height - paddingY}`;

  return (
    <div className="w-full relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1677FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1677FF" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[6.5, 7.0, 7.5, 8.0, 8.5].map((g) => {
          const y = getY(g);
          return (
            <g key={g}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-medium"
              >
                {g.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* Target reference line */}
        <line
          x1={paddingX}
          y1={getY(7.5)}
          x2={width - paddingX}
          y2={getY(7.5)}
          stroke="#F59E0B"
          strokeDasharray="2 2"
          strokeWidth="1"
        />

        {/* Filled gradient area */}
        <polygon points={areaPointsStr} fill="url(#gpaGradient)" />

        {/* Line */}
        <polyline
          fill="none"
          stroke="#1677FF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pointsStr}
        />

        {/* Points and Labels */}
        {data.map((d, i) => {
          const x = getX(i);
          const y = getY(d.gpa);
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={d.week}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              {/* Vertical guideline on hover */}
              {isHovered && (
                <line
                  x1={x}
                  y1={paddingY}
                  x2={x}
                  y2={height - paddingY}
                  stroke="#1677FF"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}

              {/* Data circle */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? '#0D47A1' : '#FFFFFF'}
                stroke="#1677FF"
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-150"
              />

              {/* Point value text */}
              <text
                x={x}
                y={y - 8}
                textAnchor="middle"
                className={`text-[10px] font-bold ${
                  isHovered ? 'fill-blue-700' : 'fill-slate-600'
                }`}
              >
                {d.gpa.toFixed(1)}
              </text>

              {/* Week label */}
              <text
                x={x}
                y={height - 8}
                textAnchor="middle"
                className={`text-[10px] ${
                  isHovered ? 'fill-blue-600 font-semibold' : 'fill-slate-400 font-normal'
                }`}
              >
                {d.week.replace('Tuần ', 'T')}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-1 px-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1677FF]" />
            Điểm trung bình
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-t border-dashed border-amber-500" />
            Mục tiêu (7.5)
          </span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-600">Đạt chuẩn tuần 8: 7.7</span>
      </div>
    </div>
  );
};

// --- Bar Chart: Weekly Attendance Rate ---
export interface AttendancePoint {
  week: string;
  presentRate: number;
  excused: number;
  unexcused: number;
}

export const AttendanceBarChart: React.FC<{ data: AttendancePoint[] }> = ({ data }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const height = 180;
  const paddingX = 25;
  const paddingY = 25;
  const width = 500;
  const barWidth = 26;

  const getX = (index: number) => {
    return paddingX + (index * (width - paddingX * 2)) / (data.length - 1);
  };

  return (
    <div className="w-full relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        {/* Baseline & lines */}
        {[90, 95, 100].map((rate) => {
          const y = height - paddingY - ((rate - 85) / 15) * (height - paddingY * 2);
          return (
            <g key={rate}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
              <text x={paddingX - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400">
                {rate}%
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = getX(i) - barWidth / 2;
          const barHeight = Math.max(8, ((d.presentRate - 85) / 15) * (height - paddingY * 2));
          const y = height - paddingY - barHeight;
          const isSelected = activeIdx === i;

          return (
            <g
              key={d.week}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              className="cursor-pointer"
            >
              {/* Rounded bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                fill={isSelected ? '#0D47A1' : '#1677FF'}
                className="transition-colors duration-200"
              />

              {/* Value on top */}
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-700"
              >
                {d.presentRate}%
              </text>

              {/* X label */}
              <text
                x={x + barWidth / 2}
                y={height - 8}
                textAnchor="middle"
                className={`text-[10px] ${isSelected ? 'fill-blue-600 font-bold' : 'fill-slate-400'}`}
              >
                {d.week.replace('Tuần ', 'T')}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-1 px-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#1677FF]" />
          Tỷ lệ đi học đầy đủ (%)
        </span>
        <span className="text-[11px] font-medium text-slate-600">TB 8 tuần: 97.3%</span>
      </div>
    </div>
  );
};

// --- Donut Chart: Phân loại học lực & Hạnh kiểm ---
export interface DonutSegment {
  label: string;
  count: number;
  color: string;
}

export const DonutChart: React.FC<{
  title?: string;
  centerNumber: number | string;
  centerLabel: string;
  segments: DonutSegment[];
  size?: number;
}> = ({ centerNumber, centerLabel, segments, size = 170 }) => {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const total = segments.reduce((sum, s) => sum + s.count, 0) || 1;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Base background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {segments.map((segment) => {
            const percent = segment.count / total;
            const strokeDashoffset = circumference * (1 - percent);
            const rotation = accumulatedPercent * 360;
            accumulatedPercent += percent;

            const isHovered = hoveredLabel === segment.label;

            return (
              <circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${circumference * percent} ${circumference * (1 - percent)}`}
                strokeDashoffset={0}
                transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
                onMouseEnter={() => setHoveredLabel(segment.label)}
                onMouseLeave={() => setHoveredLabel(null)}
                className="transition-all duration-200 cursor-pointer"
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-[#172B4D] tracking-tight">
            {centerNumber}
          </span>
          <span className="text-[11px] font-semibold text-[#6B7A90] uppercase tracking-wider">
            {centerLabel}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex flex-col gap-2 w-full max-w-[170px]">
        {segments.map((seg) => {
          const percent = ((seg.count / total) * 100).toFixed(1);
          const isHovered = hoveredLabel === seg.label;

          return (
            <div
              key={seg.label}
              onMouseEnter={() => setHoveredLabel(seg.label)}
              onMouseLeave={() => setHoveredLabel(null)}
              className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                isHovered ? 'bg-slate-100 font-semibold' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-slate-700">{seg.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800">{seg.count}</span>
                <span className="text-[10px] text-slate-400">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Subject Average Bar Chart ---
export const SubjectAvgChart: React.FC<{
  subjects: { name: string; avg: number }[];
}> = ({ subjects }) => {
  return (
    <div className="space-y-3">
      {subjects.map((sub) => {
        const percent = (sub.avg / 10) * 100;
        let barColor = '#1677FF';
        if (sub.avg >= 8.0) barColor = '#22C55E';
        else if (sub.avg < 6.5) barColor = '#F59E0B';
        if (sub.avg < 5.0) barColor = '#EF4444';

        return (
          <div key={sub.name} className="flex items-center gap-3 text-xs">
            <span className="w-20 font-medium text-slate-700 truncate">{sub.name}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percent}%`, backgroundColor: barColor }}
              />
            </div>
            <span className="w-8 font-bold text-right text-slate-800">{sub.avg.toFixed(1)}</span>
          </div>
        );
      })}
    </div>
  );
};
