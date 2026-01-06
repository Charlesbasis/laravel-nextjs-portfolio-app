import { ProfileField } from '@/src/types';
import { AlertCircle } from 'lucide-react';
import React from 'react';

interface DynamicFieldProps {
  field: ProfileField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const stringValue = typeof value === 'string' ? value : '';
  
  const baseClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-300'
  }`;

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <input
            type={field.type}
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={typeof value === 'number' ? value : ''}
            onChange={(e) => onChange(Number(e.target.value))}
            className={baseClasses}
            placeholder={field.placeholder}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
            placeholder={field.placeholder}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            className={baseClasses}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {field.description && <p className="text-xs text-gray-500 mt-1">{field.description}</p>}
      {error && (
        <div className="flex items-center mt-2 text-red-600 text-sm">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};
