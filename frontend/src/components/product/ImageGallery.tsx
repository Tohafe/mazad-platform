import { useEffect, useState } from 'react';
import type { ProductImage } from '../../types';
import PLACE_HOLDER from '../../assets/place_holder.svg'

interface ImageGalleryProps {
  images: ProductImage[];
}

const PLACEHOLDER_IMAGE: ProductImage = {
  src: PLACE_HOLDER,
  alt: 'No image available',
};

export function ImageGallery({ images }: ImageGalleryProps) {
  const safeImages = images?.length ? images : [PLACEHOLDER_IMAGE];
  const [activeImage, setActiveImage] = useState<ProductImage>(safeImages[0]);

  useEffect(() => setActiveImage(safeImages[0]), [safeImages])

  if (!images?.length) {
    return (
      <div className="flex items-center justify-center w-full h-75 bg-gray-50 text-gray-400 text-sm">
        <img src={PLACEHOLDER_IMAGE.src} alt={PLACEHOLDER_IMAGE.alt} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="flex flex-col md:flex-row items-center w-full md:w-fit bg-white">
        
        {/* Main Image */}
        <div className="w-full md:w-128 md:h-128 h-80 sm:h-100  flex-none xl:-ml-35">
          <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white">
            <img 
              className="w-full h-full object-cover p-2"
              src={activeImage.src} 
              alt={activeImage.alt} 
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_IMAGE.src;
              }}
            />
          </div>
        </div>

        {/* Thumbnail Group */}
        <div className="w-full lg:w-32 xl:w-100 flex-none">
          <div className="grid grid-cols-4 md:grid-cols-1 xl:grid-cols-2">
            {images.slice(0, 4).map((img, index) => (
              <button
                key={index}
                type="button"
                className="w-full aspect-square md:w-32 md:h-32 xl:w-50 xl:h-50 cursor-pointer transition-all overflow-hidden relative flex-none bg-white border-2 border-transparent hover:border-blue-500"
                onClick={() => setActiveImage(img)}
              >
                <img 
                  className="w-full h-full object-cover p-1" 
                  src={img.src} 
                  alt={img.alt} 
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_IMAGE.src;
                  }}
                />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
