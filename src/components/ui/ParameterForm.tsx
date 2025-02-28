import React from 'react';

interface Parameter {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select';
  value: string | number;
  options?: { value: string; label: string }[];
  onChange: (value: string | number) => void;
}

interface ParameterFormProps {
  parameters: Parameter[];
  onSubmit?: () => void;
}

const ParameterForm: React.FC<ParameterFormProps> = ({ parameters, onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {parameters.map((param) => (
        <div key={param.id}>
          <label htmlFor={param.id} className="block text-sm font-medium text-gray-700">
            {param.label}
          </label>
          {param.type === 'select' ? (
            <select
              id={param.id}
              value={param.value}
              onChange={(e) => param.onChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {param.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={param.type}
              id={param.id}
              value={param.value}
              onChange={(e) => param.onChange(param.type === 'number' ? Number(e.target.value) : e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          )}
        </div>
      ))}
      {onSubmit && (
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Appliquer
        </button>
      )}
    </form>
  );
};

export default ParameterForm;