import React from 'react';
import { CategorizationResult } from '../types';
import { ProjectIcon } from './icons/ProjectIcon';
import { TagIcon } from './icons/TagIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';


interface ResultDisplayProps {
  editedCategorization: CategorizationResult | null;
  onCategorizationChange: (newCategorization: CategorizationResult) => void;
  isLoading: boolean;
  isCategorized: boolean;
  onConfirm: () => void;
  onReject: () => void;
  availableProjects: string[];
  availableTags: string[];
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
    editedCategorization, 
    onCategorizationChange, 
    isLoading, 
    isCategorized,
    onConfirm, 
    onReject,
    availableProjects,
    availableTags
}) => {
  if (isLoading) {
    return (
      <div className="w-full bg-base-200 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary"></div>
        <p className="mt-4 text-content-200">AI is analyzing your file...</p>
      </div>
    );
  }
  
  if (isCategorized) {
    return (
        <div className="w-full bg-base-200 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[200px] text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4"/>
          <h2 className="text-2xl font-bold text-content-100">Categorized!</h2>
          <p className="text-content-200 mt-2">Ready for the next file.</p>
        </div>
    );
  }

  if (!editedCategorization) {
    return (
        <div className="w-full bg-base-200 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-content-200">Suggestions will appear here once a file is processed.</p>
        </div>
    );
  }
  
  const unselectedTags = availableTags.filter(t => !editedCategorization.tags.includes(t));

  const handleAddTag = (tag: string) => {
    if (tag && !editedCategorization.tags.includes(tag)) {
        onCategorizationChange({
            ...editedCategorization,
            tags: [...editedCategorization.tags, tag],
        });
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onCategorizationChange({
        ...editedCategorization,
        tags: editedCategorization.tags.filter(tag => tag !== tagToRemove)
    });
  }

  return (
    <div className="w-full bg-base-200 p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-content-100 mb-6 text-center">AI Suggestion</h2>
      
      <div className="mb-6 space-y-2">
        <label htmlFor="project-select" className="flex items-center text-lg text-content-200">
            <ProjectIcon className="w-6 h-6 mr-3 text-brand-secondary"/>
            <span>Project</span>
        </label>
        <select 
            id="project-select"
            value={editedCategorization.project}
            onChange={(e) => onCategorizationChange({ ...editedCategorization, project: e.target.value })}
            className="w-full bg-base-100 border border-base-300 rounded-md px-3 py-2 text-content-100 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition"
        >
            {availableProjects.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center text-lg text-content-200">
            <TagIcon className="w-6 h-6 mr-3 text-brand-secondary"/>
            <span>Tags</span>
        </div>
        <div className="flex flex-wrap gap-2 bg-base-100 p-3 rounded-md min-h-[48px]">
          {editedCategorization.tags.length > 0 ? (
            editedCategorization.tags.map(tag => (
              <span key={tag} className="flex items-center bg-brand-primary text-white text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-blue-200 hover:text-white">
                    <TrashIcon className="w-3 h-3"/>
                </button>
              </span>
            ))
          ) : (
            <p className="text-content-200 italic p-1">No tags suggested. Add one below.</p>
          )}
        </div>
        {unselectedTags.length > 0 && (
            <select
                value=""
                onChange={(e) => handleAddTag(e.target.value)}
                className="w-full bg-base-100 border border-base-300 rounded-md px-3 py-2 text-content-100 focus:ring-2 focus:ring-brand-secondary focus:outline-none transition"
            >
                <option value="" disabled>Add a tag...</option>
                {unselectedTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        )}
      </div>

      <div className="flex justify-between gap-4 mt-8">
        <button onClick={onReject} className="w-full py-2 px-4 rounded-md bg-base-300 text-content-100 hover:bg-gray-600 transition-colors">
            Reject
        </button>
        <button onClick={onConfirm} className="w-full py-2 px-4 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors">
            Confirm
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;