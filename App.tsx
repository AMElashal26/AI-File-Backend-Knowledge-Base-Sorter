import React, { useState, useCallback } from 'react';
import { UploadedFile, CategorizationResult } from './types';
import { categorizeFile } from './services/geminiService';
import ConfigManager from './components/ConfigManager';
import FileUploader from './components/FileUploader';
import ResultDisplay from './components/ResultDisplay';
import { ProjectIcon } from './components/icons/ProjectIcon';
import { TagIcon } from './components/icons/TagIcon';

function App() {
  const [projects, setProjects] = useState<string[]>(['Work', 'Personal', 'Side-Project']);
  const [tags, setTags] = useState<string[]>(['Urgent', 'Invoice', 'Receipt', 'Idea', 'Inspiration', 'Code Snippet']);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [suggestion, setSuggestion] = useState<CategorizationResult | null>(null);
  const [editedCategorization, setEditedCategorization] = useState<CategorizationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategorized, setIsCategorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearFile = useCallback(() => {
    if (file?.previewUrl) {
      URL.revokeObjectURL(file.previewUrl);
    }
    setFile(null);
    setSuggestion(null);
    setEditedCategorization(null);
    setError(null);
    setIsLoading(false);
    setIsCategorized(false);
  }, [file]);

  const handleFileSelect = useCallback(async (selectedFile: UploadedFile) => {
    // Clear previous state before processing new file
    clearFile();
    setFile(selectedFile);
    setIsLoading(true);

    if (projects.length === 0 || tags.length === 0) {
      setError("Please define at least one project and one tag before categorizing.");
      setIsLoading(false);
      return;
    }

    try {
      const categorizationResult = await categorizeFile(selectedFile, projects, tags);
      setSuggestion(categorizationResult);
      setEditedCategorization(categorizationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [projects, tags, clearFile]);

  const handleConfirm = () => {
    // In a real app, you would now use `editedCategorization` to move the file,
    // update a database, etc.
    console.log("Confirmed Categorization:", editedCategorization);
    setIsCategorized(true);
    setTimeout(() => {
        clearFile();
    }, 2000); // Show success message for 2 seconds
  };


  return (
    <div className="min-h-screen bg-base-100 text-content-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-brand-secondary">
            AI Knowledge Base Sorter
          </h1>
          <p className="mt-4 text-lg text-content-200 max-w-2xl mx-auto">
            Get AI-powered suggestions to categorize your files, then confirm or edit them yourself.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Configuration */}
          <div className="space-y-8">
            <ConfigManager
              title="Projects"
              items={projects}
              setItems={setProjects}
              icon={<ProjectIcon className="w-6 h-6 text-brand-secondary" />}
              placeholder="e.g., Household Finances"
            />
            <ConfigManager
              title="Tags"
              items={tags}
              setItems={setTags}
              icon={<TagIcon className="w-6 h-6 text-brand-secondary" />}
              placeholder="e.g., tax-document"
            />
          </div>

          {/* Right Column: Uploader and Results */}
          <div className="space-y-8">
            <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-content-100 mb-4 text-center">1. Upload File</h2>
                <FileUploader onFileSelect={handleFileSelect} clearFile={clearFile} file={file} />
            </div>
            
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            <div className="sticky top-8">
              <h2 className="text-xl font-bold text-content-100 mb-4 text-center">2. Review Suggestion</h2>
              <ResultDisplay 
                editedCategorization={editedCategorization}
                onCategorizationChange={setEditedCategorization}
                isLoading={isLoading} 
                isCategorized={isCategorized}
                onConfirm={handleConfirm}
                onReject={clearFile}
                availableProjects={projects}
                availableTags={tags}
                />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;