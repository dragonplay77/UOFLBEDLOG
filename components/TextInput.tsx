
import React from 'react';

interface TextInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  required = false,
  error
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors ${disabled ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};