import { useEffect, useRef } from 'react';
import '../styles/backgroundbubbles.css';

const BackgroundBubbles = () => {
  const sectionRef = useRef(null);

  const createBubbles = () => {
    if (!sectionRef.current) return;

    const createElement = document.createElement('span');
    const size = Math.random() * 100;

    // Define margins to keep bubbles away from left and right edges
    const marginLeft = 20; // Distance from left edge
    const marginRight = 20; // Distance from right edge

    // Calculate the safe range for left position
    const minLeft = marginLeft; // Bubble's left edge is at least marginLeft from viewport left
    const maxLeft = sectionRef.current.clientWidth - (10 + size) - marginRight; // Ensure right edge is at least marginRight from viewport right

    // Ensure maxLeft is not less than minLeft
    if (maxLeft <= minLeft) return;

    // Calculate leftPosition to keep bubble within margins
    const leftPosition = minLeft + Math.random() * (maxLeft - minLeft);

    createElement.style.width = `${10 + size}px`;
    createElement.style.height = `${10 + size}px`;
    createElement.style.left = `${leftPosition}px`;

    sectionRef.current.appendChild(createElement);

    setTimeout(() => {
      createElement.remove();
    }, 5000);
  };

  useEffect(() => {
    const interval = setInterval(createBubbles, 300);

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