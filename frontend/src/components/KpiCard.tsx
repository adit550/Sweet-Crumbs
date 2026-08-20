import React from 'react';
import './KpiCard.css';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendText?: string;
  type?: 'default' | 'success' | 'warning' | 'danger';
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendText,
  type = 'default' 
}) => {
  return (
    <div className="card kpi-card">
      <div className="kpi-header">
        <div className="kpi-icon-wrapper" data-type={type}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`kpi-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="kpi-content">
        <h3 className="kpi-title">{title}</h3>
        <div className="kpi-value">{value}</div>
        {trendText && <p className="kpi-trend-text">{trendText}</p>}
      </div>
    </div>
  );
};
