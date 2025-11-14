import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  uploadedImageUrl: string | null;
  hasImage: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  onGenerate,
  isGenerating,
  uploadedImageUrl,
  hasImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl transition-all duration-300">
      {!uploadedImageUrl ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
          onClick={handleUploadClick}
        >
          <div className="flex flex-col items-center justify-center text-gray-500">
            <UploadIcon className="w-12 h-12 mb-4" />
            <p className="font-semibold text-gray-700">Click to upload your photo</p>
            <p className="text-sm">PNG, JPG, or WEBP</p>
          </div>
        </div>
      ) : (
        <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-4">Your Photo:</p>
            <img 
                src={uploadedImageUrl} 
                alt="Uploaded preview" 
                className="max-h-64 w-auto mx-auto rounded-lg shadow-lg"
            />
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />

      <div className="mt-8 text-center">
        <button
          onClick={onGenerate}
          disabled={!hasImage || isGenerating}
          className="px-8 py-3 w-full md:w-auto bg-blue-500 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          Generate My Tết Journey
        </button>
      </div>
    </div>
  );
};