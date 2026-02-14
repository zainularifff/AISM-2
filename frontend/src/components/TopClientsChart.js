import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

export default function TopClientsChart({ data }) {
  const chartData = [
    { name: 'KWSP', revenue: 45000 },
    { name: 'JPJ', revenue: 38000 },
    { name: 'PERKESO', revenue: 32000 },
    { name: 'RISDA_CLIENT_1', revenue: 28000 },
    { name: 'RISDA_CLIENT_2', revenue: 22000 }
  ];

  const COLORS = ['#54a0ff', '#ffa502', '#2ed573', '#ff4757', '#a4b0bd'];

  return (
    <div className="chart-container">
      <h3>Top 5 Clients by Revenue</h3>
      <BarChart
        width={500}
        height={300}
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={140} />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Bar dataKey="revenue" fill="#54a0ff" radius={[0, 8, 8, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}
