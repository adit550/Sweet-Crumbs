import React from 'react';
import './SettingsSection.css';

interface SettingsSectionProps {
  id?: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  badge?: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  id,
  icon,
  title,
  description,
  badge,
  children,
  footerActions,
}) => {
  return (
    <section id={id} className="card settings-section-card">
      <div className="settings-section-header">
        <div className="settings-section-title-wrap">
          {icon && <div className="settings-section-icon">{icon}</div>}
          <div>
            <div className="settings-section-title-row">
              <h3>{title}</h3>
              {badge && <span className="settings-section-badge">{badge}</span>}
            </div>
            {description && <p className="text-muted text-sm">{description}</p>}
          </div>
        </div>
      </div>

      <div className="settings-section-body">
        {children}
      </div>

      {footerActions && (
        <div className="settings-section-footer">
          {footerActions}
        </div>
      )}
    </section>
  );
};
