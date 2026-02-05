import React from 'react';
import AnimatedSelect from './AnimatedSelect';
import { formFields } from './formFields';

export default function UserInputs({ formData, handleChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {formFields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="block text-sm font-semibold text-indigo-100">
            {field.label}
          </label>
          {field.type === 'select' ? (
            <AnimatedSelect
              field={field}
              value={formData[field.name]}
              onChange={handleChange}
            />
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              min={field.min}
              max={field.max}
              step={field.step || '1'}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 bg-gray-800/40 border border-white/20 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            />
          )}
        </div>
      ))}
    </div>
  );
}