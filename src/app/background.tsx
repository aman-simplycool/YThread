import React, { useEffect, useState } from 'react';
import './style.css';

interface Star {
  id: number;
  left: number;
  animationDuration: number;
}

const FallingStars: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const generateStar = () => {
    const left = Math.random() * 1000; // Start from anywhere in the top
    const animationDuration = Math.random() * 2 + 3; // Random duration between 3s and 5s
    return { id: Date.now() + Math.random(), left, animationDuration }; // Unique ID for each star
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prevStars) => {
        // Add a new star and keep only the stars that are not finished
        return [...prevStars, generateStar()].filter((star) => {
          // Keep stars that are still in the animation (not finished)
          return star.animationDuration > 0;
        });
      });
    }, 500); // Generate a new star every 500ms

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.left}vw`,
            animation: `fall ${star.animationDuration}s linear forwards`,
            opacity: Math.random() * 0.7 + 0.3, // Random opacity for each star
            width: '15px', // Thicker stars
            height: '15px',
            backgroundColor: 'white',
            borderRadius: '50%',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100vh) translateX(-100vw); // Move towards the left bottom
          }
        }
      `}</style>
    </div>
  );
};

export default FallingStars;
