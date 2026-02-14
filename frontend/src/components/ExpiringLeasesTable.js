import React from 'react';
import '../styles/ExpiringLeasesTable.css';

export default function ExpiringLeasesTable({ data }) {
  const leases = [
    { id: 1, client: 'KWSP', deviceCount: 25, expiryDate: '2026-03-15', daysLeft: 29, urgency: 'critical' },
    { id: 2, client: 'JPJ', deviceCount: 18, expiryDate: '2026-03-20', daysLeft: 34, urgency: 'high' },
    { id: 3, client: 'PERKESO', deviceCount: 12, expiryDate: '2026-04-10', daysLeft: 55, urgency: 'warning' },
    { id: 4, client: 'RISDA_CLIENT_1', deviceCount: 8, expiryDate: '2026-05-01', daysLeft: 76, urgency: 'normal' }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return '#ff4757';
      case 'high':
        return '#ffa502';
      case 'warning':
        return '#ffd700';
      default:
        return '#2ed573';
    }
  };

  return (
    <div className="expiring-leases-container">
      <h3>⚠️ Expiring Leases Alert</h3>
      <table className="expiring-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Devices</th>
            <th>Expiry Date</th>
            <th>Days Left</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leases.map((lease) => (
            <tr key={lease.id} className={`urgency-${lease.urgency}`}>
              <td className="client-name">{lease.client}</td>
              <td>{lease.deviceCount}</td>
              <td>{lease.expiryDate}</td>
              <td className="days-left">{lease.daysLeft} days</td>
              <td>
                <span
                  className="urgency-badge"
                  style={{ backgroundColor: getUrgencyColor(lease.urgency) }}
                >
                  {lease.urgency.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
