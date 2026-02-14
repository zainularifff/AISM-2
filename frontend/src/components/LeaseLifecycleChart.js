import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function LeaseLifecycleChart({ data }) {
  const chartData = [
    {
      name: 'Expiring Soon',
      '0-3 months': 45,
      '3-6 months': 32,
      '6-12 months': 28,
      '12+ months': 95
    }
  ];

  return (
    <div className="chart-container">
      <h3>Lease Lifecycle Timeline</h3>
      <BarChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="0-3 months" stackId="a" fill="#ff4757" />
        <Bar dataKey="3-6 months" stackId="a" fill="#ffa502" />
        <Bar dataKey="6-12 months" stackId="a" fill="#54a0ff" />
        <Bar dataKey="12+ months" stackId="a" fill="#2ed573" />
      </BarChart>
    </div>
  );
}
