
// import React, { useState } from 'react';

// // Using the same props interface we defined earlier
// interface GalleryProps {
//   images: string[];
//   altText: string;
// }

// const Gallery: React.FC<GalleryProps> = ({ images, altText }) => {
//   const [activeImage, setActiveImage] = useState<string>(images[0]);

//   return (
//     // 'w-fit' ensures the container only grows to fit these fixed elements
//     <div className="flex flex-row items-center w-fit mx-auto bg-white p-4">
      
//       {/* 1. Main Image: Fixed at 450px */}
//       <div className="w-[450px] h-[450px] flex-none">
//         <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white">
//           <img 
//             src={activeImage} 
//             alt={altText} 
//             className="w-full h-full object-contain p-2" 
//           />
//         </div>
//       </div>

//       {/* 2. Thumbnail Group: Balanced and centralized */}
//       {/* We use a slightly larger width here to make them feel 'present' */}
//       <div className="w-[410px] flex-none">
//         <div className="grid grid-cols-2">
//           {images.slice(1, 5).map((img, index) => (
//             <div 
//               key={index}
//               className="w-[200px] h-[200px] cursor-pointer transition-all overflow-hidden relative flex-none bg-white"
//               onClick={() => setActiveImage(img)}
//             >
//               <img src={img} alt="thumbnail" className="w-full h-full object-contain p-1" />
              
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 3. Empty Placeholder for Bidding Panel */}
//       <div className="w-[380px] h-[450px] ml-4 border-l pl-8 flex flex-col justify-start">
//         {/* We will build the BiddingPanel here next */}
//         <div className="w-full h-full border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center text-gray-300">
//           Bidding Panel Area
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Gallery;


///////////////////////////////////////////////////////////////////////////////


// import React, { useState } from 'react';

// interface GalleryProps {
//   images: string[];
//   altText: string;
// }

// const Gallery: React.FC<GalleryProps> = ({ images, altText }) => {
//   const [activeImage, setActiveImage] = useState<string>(images[0]);

//   return (
//     // Reduced padding 'p-2' to keep it tight
//     <div className="flex flex-row items-center w-fit mx-auto bg-white p-2">
      
//       {/* Main Image */}
//       <div className="w-[400px] h-[400px] flex-none">
//         <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white">
//           <img 
//             src={activeImage} 
//             alt={altText} 
//             className="w-full h-full object-contain p-2" 
//           />
//         </div>
//       </div>

//       {/* 2. Thumbnail Group: Reduced container width */}
//       <div className="w-[370px] flex-none">
//         <div className="grid grid-cols-2">
//           {images.slice(0, 4).map((img, index) => (
//             <div 
//               key={index}
//               // Reduced thumbnails to 180px
//               className="w-[180px] h-[180px] cursor-pointer transition-all overflow-hidden relative flex-none bg-white"
//               onClick={() => setActiveImage(img)}
//             >
//               <img src={img} alt="thumbnail" className="w-full h-full object-contain p-1" />
              
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 3. Bidding Panel Placeholder: Height matched to new main image (400px) */}
//       <div className="w-[350px] h-[400px] ml-4 border-l pl-6 flex flex-col justify-start">
//         <div className="w-full h-full border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center text-gray-300">
//           Bidding Panel Area
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Gallery;




/////////

// src/components/Gallery/Gallery.tsx
// import React, { useState } from 'react';

// interface GalleryProps {
//   images: string[];
//   altText: string;
// }

// const Gallery: React.FC<GalleryProps> = ({ images, altText }) => {
//   const [activeImage, setActiveImage] = useState<string>(images[0]);

//   return (
//     <div className="flex flex-col lg:flex-row items-center lg:items-start w-full lg:w-fit bg-white p-2">
//       {/* 1. Main Image */}
//       <div className="w-full max-w-[400px] aspect-square lg:w-[400px] lg:h-[400px] flex-none">
//         <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white">
//           <img 
//             src={activeImage} 
//             alt={altText} 
//             className="w-full h-full object-contain p-2" 
//           />
//         </div>
//       </div>

//       {/* 2. Thumbnail Group */}
//       <div className="w-full max-w-[370px] lg:w-[370px] flex-none mt-2 lg:mt-0">
//         <div className="grid grid-cols-2">
//           {images.slice(1, 5).map((img, index) => (
//             <div 
//               key={index}
//               className="aspect-square lg:w-[180px] lg:h-[180px] cursor-pointer overflow-hidden relative bg-white"
//               onClick={() => setActiveImage(img)}
//             >
//               <img src={img} alt="thumbnail" className="w-full h-full object-contain p-1" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Gallery;

// src/components/Gallery/Gallery.tsx
import React, { useState } from 'react';

interface GalleryProps {
  images: string[];
  altText: string;
  title: string; // New required prop
}

const Gallery: React.FC<GalleryProps> = ({ images, altText, title }) => {
  const [activeImage, setActiveImage] = useState<string>(images[0]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Title Section: Stays aligned to the page content */}
      <div className="mb-6 lg:ml-[180px]"> 
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
          {title}
        </h1>
      </div>

      {/* 2. Gallery Wrapper: Contains the Images and Placeholder */}
      <div className="flex flex-row items-center w-fit bg-white">
        
        {/* Main Image */}
        <div className="w-[400px] h-[400px] flex-none">
          <div className="w-full h-full overflow-hidden flex items-center justify-center bg-white">
            <img 
              src={activeImage} 
              alt={altText} 
              className="w-full h-full object-contain p-2" 
            />
          </div>
        </div>

        {/* Thumbnail Group */}
        <div className="w-[370px] flex-none">
          <div className="grid grid-cols-2">
            {images.slice(0, 4).map((img, index) => (
              <div 
                key={index}
                className="w-[180px] h-[180px] cursor-pointer transition-all overflow-hidden relative flex-none bg-white"
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-contain p-1" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Gallery;