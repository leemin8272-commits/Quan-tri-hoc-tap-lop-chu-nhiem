import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  subtextColor?: string;
  icon: React.ReactNode;
  iconBg: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'info' | 'purple';
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  subtextColor = 'text-slate-500',
  icon,
  iconBg,
  badge,
  onClick,
}) => {
  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-[#1677FF] border-blue-200',
    purple: 'bg-purple-50 text-[#7C5CFC] border-purple-200',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4.5 border border-[#E3ECF8] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7A90] uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-extrabold text-[#172B4D] tracking-tight">{value}</span>
        {badge && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeStyles[badge.variant]}`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtext && <div className={`text-xs mt-1 font-medium ${subtextColor}`}>{subtext}</div>}
    </div>
  );
};
