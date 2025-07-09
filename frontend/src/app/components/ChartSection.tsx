import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export function ChartSection({
  title,
  value,
  sub,
  subColor,
  chartType,
  chartData,
  chartOptions,
  children,
}: any) {
  return (
    <div className="rounded-2xl bg-white/60 shadow-xl p-4 flex flex-col justify-between w-full mb-4">
      <div className="flex flex-row justify-between items-start h-full">
        <div className="flex flex-col justify-between h-full">
          <div>
            <span className="text-xs text-gray-500 block">{title}</span>
            {sub && (
              <span className="text-xs block mt-1" style={{ color: subColor }}>
                {sub}
              </span>
            )}
          </div>
          <div className="mt-auto flex items-end gap-1">
            <span className="text-2xl font-bold text-gray-800">{value}</span>
          </div>
        </div>
        {children}
      </div>
      <div className="w-full h-14 mt-2">
        {chartType === 'line' ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>
    </div>
  );
}
