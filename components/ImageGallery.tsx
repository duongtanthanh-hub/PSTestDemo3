import React from 'react';
import { GeneratedImage } from '../types';

interface ImageGalleryProps {
  images: GeneratedImage[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
      {images.map((image) => (
        <div 
          key={image.year}
          className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20"
        >
          <img src={image.src} alt={`Tết in the ${image.year}`} className="w-full h-auto object-cover aspect-square"/>
          <div className="p-5">
            <h3 className="text-2xl font-bold text-blue-600">{image.year}</h3>
            <p className="mt-2 text-slate-600 text-sm">{image.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
