import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileLoad: (content: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileLoad }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileLoad(content);
      };
      reader.readAsText(file);
    }
  }, [onFileLoad]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/xml': ['.xml'],
      'text/xml': ['.xml'],
      'text/plain': ['.xml']  // Added for broader compatibility
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-gray-600">
        <Upload className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">
          {isDragActive ? 'Drop your XML file here' : 'Drag & drop an XML file here'}
        </p>
        <p className="text-sm mt-2">or click to select a file</p>
        <p className="text-xs text-gray-500 mt-2">.xml files only</p>
      </div>
    </div>
  );
};