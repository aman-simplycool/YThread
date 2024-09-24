import React from 'react';

const images = [
  '/3dimg1.jpg',
  '/3dimg6.jpg',
  '/3dimg2.jpg',
  '/3dimg5.jpg',
  '/3dimg3.jpg',
  '/3dimg4.jpg',
  '/3dimg7.jpg'
];

const ConveyorBelt: React.FC = () => {
  return (
    <div className="overflow-hidden relative  h-200 w-full bottom-0">
      <div className="whitespace-nowrap animate-scroll">
        {images.map((src, index) => (
          <img key={index} src={src} alt='Designed by Freepik' className="inline-block h-full mx-2" />
        ))}
      </div>
    </div>
  );
};

export default ConveyorBelt;
