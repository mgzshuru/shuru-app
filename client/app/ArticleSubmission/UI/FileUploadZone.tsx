"use client";

import React, { useState, useRef, useId } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { FileUploadZoneProps } from '../types';
import { validateFileSize, validateFileType } from '../formUtils';
import { MAX_FILE_SIZE_MB } from '../constants';

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ 
  onFileSelect, 
  accept, 
  multiple = false, 
  children,
  error 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  const inputId = useId();

  const handleFileValidation = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      if (!validateFileSize(file)) {
        errors.push(`${file.name}: الحجم يتجاوز ${MAX_FILE_SIZE_MB} ميجابايت`);
        return;
      }

      if (!validateFileType(file, accept)) {
        errors.push(`${file.name}: نوع الملف غير مدعوم`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setUploadError(errors.join('\n'));
    } else {
      setUploadError('');
    }

    return validFiles;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = handleFileValidation(files);
    
    if (validFiles.length > 0) {
      // Simply pass File[] when multiple, or single File when not multiple
      onFileSelect(multiple ? validFiles : validFiles[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    e.target.value = '';
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          isDragOver 
            ? 'border-orange-500 bg-orange-50' 
            : error || uploadError
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-black hover:bg-gray-50'
        }`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
        />
        
        <div className="space-y-3">
          {children}
          
          <div className="text-sm text-gray-500 space-y-1">
            <p className="font-medium">أو اسحب الملفات هنا</p>
            <p>الحد الأقصى: {MAX_FILE_SIZE_MB} ميجابايت {multiple ? 'لكل ملف' : ''}</p>
            {accept.includes('image') && <p>JPG, PNG, GIF, WebP</p>}
            {accept.includes('.doc') && <p>DOC, DOCX</p>}
          </div>
        </div>
      </div>
      
      {/* Error Messages - Fast Company Style */}
      {(error || uploadError) && (
        <div className="mt-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
          <div className="flex items-start">
            <X className="w-5 h-5 text-red-500 ml-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm font-medium whitespace-pre-line">
              {error || uploadError}
            </p>
          </div>
        </div>
      )}
      
      {/* Success Feedback */}
      {isDragOver && (
        <div className="mt-3 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r">
          <div className="flex items-center">
            <Upload className="w-5 h-5 text-orange-500 ml-2" />
            <p className="text-orange-700 text-sm font-medium">اترك الملف هنا...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;