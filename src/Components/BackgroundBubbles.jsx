import { useEffect, useRef } from 'react';
import '../styles/backgroundbubbles.css';

const BackgroundBubbles = () => {
  const sectionRef = useRef(null);

  const createBubbles = () => {
    if (!sectionRef.current) return;

    const createElement = document.createElement('span');
    const size = Math.random() * 100;

    createElement.style.width = `${10 + size}px`;
    createElement.style.height = `${10 + size}px`;
    createElement.style.left = `${Math.random() * window.innerWidth}px`;

    sectionRef.current.appendChild(createElement);

    setTimeout(() => {
      createElement.remove();
    }, 5000);
  };

  useEffect(() => {
    const interval = setInterval(createBubbles, 100);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="background-bubbles" ref={sectionRef}>
      {/* You can add children here if needed */}
    </div>
  );
};

export default BackgroundBubbles;