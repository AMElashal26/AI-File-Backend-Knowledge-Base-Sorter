
import React, { useCallback, useState } from 'react';
import { UploadedFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploaderProps {
  onFileSelect: (file: UploadedFile) => void;
  clearFile: () => void;
  file: UploadedFile | null;
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // remove data:mime/type;base64, prefix
        resolve(result.split(',')[1]);
    }
    reader.onerror = (error) => reject(error);
  });

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, clearFile, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (selectedFile: File | null) => {
    if (selectedFile) {
        if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('text/')) {
            alert('Please upload a valid image or text file.');
            return;
        }

        const content = selectedFile.type.startsWith('image/')
            ? await toBase64(selectedFile)
            : await selectedFile.text();

        const previewUrl = selectedFile.type.startsWith('image/')
            ? URL.createObjectURL(selectedFile)
            : '';

      onFileSelect({
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        content,
        previewUrl,
      });
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileChange(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);
  
  if (file) {
    return (
      <div className="p-4 bg-base-200 rounded-lg text-center">
        {file.type.startsWith('image/') ? (
          <img src={file.previewUrl} alt="Preview" className="max-h-60 mx-auto rounded-md mb-4"/>
        ) : (
          <div className="max-h-60 overflow-y-auto bg-base-100 p-4 rounded-md text-left mb-4">
             <pre className="whitespace-pre-wrap text-sm text-content-200">{file.content}</pre>
          </div>
        )}
        <p className="text-content-100 font-semibold">{file.name}</p>
        <p className="text-content-200 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
        <button
          onClick={clearFile}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Clear File
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging ? 'border-brand-secondary bg-base-300' : 'border-base-300 bg-base-200'
      }`}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
        accept="image/*,text/plain,text/markdown"
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
        <UploadIcon className="w-12 h-12 text-brand-secondary mb-4" />
        <p className="text-content-100 font-semibold">
          Drag & Drop or <span className="text-brand-secondary">Browse</span>
        </p>
        <p className="text-content-200 text-sm mt-1">Supports images and text files</p>
      </label>
    </div>
  );
};

export default FileUploader;
