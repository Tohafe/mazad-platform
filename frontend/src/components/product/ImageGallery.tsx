import { useState } from 'react';
import type { ProductImage } from '../../types';

interface ImageGalleryProps {
  images: ProductImage[];
}

const PLACEHOLDER_IMAGE: ProductImage = {
  src: 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image',
  alt: 'No image available',
};

export function ImageGallery({ images }: ImageGalleryProps) {
  const safeImages = images?.length ? images : [PLACEHOLDER_IMAGE];
  const [activeImage, setActiveImage] = useState<ProductImage>(safeImages[0]);

  if (!images?.length) {
    return (
      <div className="flex items-center justify-center w-full h-[300px] bg-gray-50 text-gray-400 text-sm">
        <img src={PLACEHOLDER_IMAGE.src} alt={PLACEHOLDER_IMAGE.alt} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="flex flex-col md:flex-row items-center w-full md:w-fit bg-white">
        
        {/* Main Image */}
        <div className="w-full md:w-[400px] h-[280px] sm:h-[350px] md:h-[400px] flex-none">
          <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white">
            <img 
              src={activeImage.src} 
              alt={activeImage.alt} 
              className="w-full h-full object-cover p-2" 
            />
          </div>
        </div>

        {/* Thumbnail Group */}
        <div className="w-full md:w-[370px] flex-none">
          <div className="grid grid-cols-4 md:grid-cols-2 gap-1 md:gap-0">
            {images.slice(0, 4).map((img, index) => (
              <button
                key={index}
                type="button"
                className="w-full aspect-square md:w-[180px] md:h-[180px] cursor-pointer transition-all overflow-hidden relative flex-none bg-white border-2 border-transparent hover:border-blue-500"
                onClick={() => setActiveImage(img)}
              >
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover p-1" 
                />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
