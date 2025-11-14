import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageGallery } from './components/ImageGallery';
import { LoadingSpinner } from './components/LoadingSpinner';
import { GeneratedImage } from './types';
import { generateTetJourneyImages } from './services/geminiService';

const App: React.FC = () => {
  const [userImageFile, setUserImageFile] = useState<File | null>(null);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setUserImageFile(file);
    setGeneratedImages(null);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerateJourney = async () => {
    if (!userImageFile) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setGenerationProgress(null);
    
    try {
      const images = await generateTetJourneyImages(userImageFile, (year) => {
        setGenerationProgress(year);
      });
      setGeneratedImages(images);
    } catch (err) {
      console.error("Generation failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during image generation. Please check your API key and try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setGenerationProgress(null);
    }
  };

  const handleReset = () => {
    setUserImageFile(null);
    setUserImageUrl(null);
    setGeneratedImages(null);
    setError(null);
    setIsLoading(false);
    setGenerationProgress(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Tết Time Traveler
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Upload a photo of yourself and watch as AI turns you into a Tết time traveler, journeying through Vietnamese celebrations of the past five decades!
          </p>
        </div>

        <div className="mt-10 max-w-2xl mx-auto">
          {!generatedImages && (
            <ImageUploader 
              onImageSelect={handleImageSelect}
              onGenerate={handleGenerateJourney}
              isGenerating={isLoading}
              uploadedImageUrl={userImageUrl}
              hasImage={!!userImageFile}
            />
          )}

          {isLoading && (
            <div className="text-center p-8">
              <LoadingSpinner />
              <p className="mt-4 text-lg text-blue-600 animate-pulse">
                {generationProgress
                  ? `Generating your journey for the ${generationProgress}...`
                  : 'Preparing your time machine...'}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-8 text-center bg-red-100 border border-red-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-700">Generation Failed</h3>
              <p className="mt-2 text-red-600">{error}</p>
              <button
                onClick={handleGenerateJourney}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {generatedImages && (
          <div className="mt-12">
            <ImageGallery images={generatedImages} />
            <div className="text-center mt-10">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Create Another Journey
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>A P/S Social Campaign Demo</p>
      </footer>
    </div>
  );
};

export default App;