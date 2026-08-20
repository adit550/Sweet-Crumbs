import React from 'react';
import './SettingsToggle.css';

interface SettingsToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`settings-toggle-wrapper ${disabled ? 'disabled' : ''}`}>
      {(label || description) && (
        <div className="toggle-text-container" onClick={() => !disabled && onChange(!checked)}>
          {label && <label htmlFor={id} className="toggle-label">{label}</label>}
          {description && <p className="toggle-desc text-muted text-sm">{description}</p>}
        </div>
      )}
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        aria-label={label || 'Toggle setting'}
        className={`settings-switch ${checked ? 'checked' : ''}`}
        onClick={() => onChange(!checked)}
        onKeyDown={handleKeyDown}
      >
        <span className="switch-thumb" />
      </button>
    </div>
  );
};
