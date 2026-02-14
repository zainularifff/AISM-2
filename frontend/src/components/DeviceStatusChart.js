import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip
} from 'recharts';

export default function DeviceStatusChart({ data }) {
  const chartData = [
    { name: 'Active', value: 450 },
    { name: 'Idle', value: 120 },
    { name: 'Maintenance', value: 65 },
    { name: 'End-of-Life', value: 35 }
  ];

  const COLORS = ['#2ed573', '#54a0ff', '#ffa502', '#ff4757'];

  return (
    <div className="chart-container">
      <h3>Device Status Distribution</h3>
      <PieChart width={500} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} devices`} />
        <Legend />
      </PieChart>
    </div>
  );
}
