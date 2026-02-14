import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function PaymentHistoryChart({ data }) {
  const chartData = [
    { month: 'Jan', paid: 95, pending: 5 },
    { month: 'Feb', paid: 92, pending: 8 },
    { month: 'Mar', paid: 98, pending: 2 },
    { month: 'Apr', paid: 88, pending: 12 },
    { month: 'May', paid: 96, pending: 4 },
    { month: 'Jun', paid: 91, pending: 9 }
  ];

  return (
    <div className="chart-container">
      <h3>Payment Compliance (%)</h3>
      <LineChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
        <Line
          type="monotone"
          dataKey="paid"
          stroke="#2ed573"
          strokeWidth={2}
          name="On-Time (%)"
          dot={{ fill: '#2ed573', r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="pending"
          stroke="#ff4757"
          strokeWidth={2}
          name="Late (%)"
          dot={{ fill: '#ff4757', r: 5 }}
        />
      </LineChart>
    </div>
  );
}
