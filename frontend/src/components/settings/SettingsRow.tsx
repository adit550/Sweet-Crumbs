import React from 'react';
import './SettingsRow.css';

interface SettingsRowProps {
  label: string;
  description?: string;
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  alignTop?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  description,
  htmlFor,
  required,
  children,
  alignTop = false,
}) => {
  return (
    <div className={`settings-row ${alignTop ? 'align-top' : ''}`}>
      <div className="settings-row-label-wrap">
        <label htmlFor={htmlFor} className="settings-row-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
        {description && <p className="settings-row-desc text-muted text-sm">{description}</p>}
      </div>
      <div className="settings-row-control">
        {children}
      </div>
    </div>
  );
};
