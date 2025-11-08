
import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ConfigManagerProps {
  title: string;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
  icon: React.ReactNode;
  placeholder: string;
}

const ConfigManager: React.FC<ConfigManagerProps> = ({ title, items, setItems, icon, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !items.includes(inputValue.trim())) {
      setItems([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setItems(items.filter((item) => item !== itemToRemove));
  };

  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-lg h-full">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-bold text-content-100 ml-3">{title}</h2>
      </div>

      <form onSubmit={handleAddItem} className="flex mb-4 gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="flex-grow bg-base-100 border border-base-300 rounded-md px-3 py-2 text-content-100 placeholder-content-200 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition"
        />
        <button
          type="submit"
          className="bg-brand-secondary text-white p-2 rounded-md hover:bg-blue-500 transition-colors flex items-center justify-center"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </form>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex justify-between items-center bg-base-100 p-2 rounded-md"
          >
            <span className="text-content-200">{item}</span>
            <button
              onClick={() => handleRemoveItem(item)}
              className="text-content-200 hover:text-red-500 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-content-200 italic py-4">No {title.toLowerCase()} added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ConfigManager;
