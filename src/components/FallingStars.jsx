// src/components/FallingStars.js
import { useEffect, useState } from 'react';
import './FallingStars.css';

export default function FallingStars({ active }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      const newStar = {
        id: Date.now(),
        left: Math.random() * 100, // random horizontal position
        delay: Math.random() * 2, // delay per star
      };
      setStars((prev) => [...prev, newStar]);

      // clean up stars after 10s
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== newStar.id));
      }, 10000);
    }, 200); // new star every 200ms

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="falling-stars">
      {stars.map((star) => (
        <img
          key={star.id}
          src="/star.svg"
          alt="star"
          className="falling-star"
          style={{
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
