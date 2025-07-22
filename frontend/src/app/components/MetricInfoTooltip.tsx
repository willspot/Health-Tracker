import React from "react";

interface MetricInfoTooltipProps {
  value: string | number;
  unit?: string;
  className?: string;
  children: React.ReactNode;
}

const MetricInfoTooltip: React.FC<MetricInfoTooltipProps> = ({ value, unit, className = "", children }) => (
  <span className={`text-xs text-gray-400 relative group ${className}`}>
    {value}{unit ? ` ${unit}` : ""}
    <span className="inline-block align-middle ml-1 cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="text-blue-500"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#3b82f6">i</text>
      </svg>
      <div className="absolute right-0 z-50 bottom-full mb-0 hidden group-hover:block bg-white border border-gray-300 shadow-lg rounded-lg p-3 min-w-[320px] max-w-[400px] text-[10px] text-gray-700 whitespace-normal">
        {children}
      </div>
    </span>
  </span>
);

export default MetricInfoTooltip; 