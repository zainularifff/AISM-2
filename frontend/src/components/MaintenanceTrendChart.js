import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export default function MaintenanceTrendChart({ data }) {
  const chartData = [
    { month: 'Jan', cost: 2400, tickets: 45 },
    { month: 'Feb', cost: 2210, tickets: 38 },
    { month: 'Mar', cost: 2290, tickets: 42 },
    { month: 'Apr', cost: 2000, tickets: 35 },
    { month: 'May', cost: 2181, tickets: 41 },
    { month: 'Jun', cost: 2500, tickets: 52 }
  ];

  return (
    <div className="chart-container">
      <h3>Maintenance Costs Trend</h3>
      <AreaChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Legend />
        <Area
          type="monotone"
          dataKey="cost"
          fill="#54a0ff"
          stroke="#0984e3"
          fillOpacity={0.3}
          name="Cost ($)"
        />
        <Area
          type="monotone"
          dataKey="tickets"
          fill="#ffa502"
          stroke="#ff8c00"
          fillOpacity={0.3}
          name="Tickets"
        />
      </AreaChart>
    </div>
  );
}
