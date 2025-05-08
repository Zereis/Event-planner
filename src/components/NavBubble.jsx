import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, useAnimation } from 'framer-motion';
import bubblePopSound from '../assets/sound/bubble-pop.mp3';
import bubbleHoverSound from '../assets/sound/bubble.mp3';
import bubbleAppearSound from '../assets/sound/bubble-appears.mp3';
import '../styles/navbubble.css';

const NavBubble = ({
  title,
  color,
  navRoute,
  position,
  size,
  zIndex,
  clickable,
  index,
  origin = { x: 0, y: -200 },
  appearDuration = 0.8,
}) => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [isExpanding, setIsExpanding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const popSoundRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const appearSoundRef = useRef(null);

  useEffect(() => {
    if (appearSoundRef.current) {
      appearSoundRef.current.currentTime = 0;
      appearSoundRef.current.play();
    }

    controls.start({
      opacity: 1,
      x: position.x,
      y: position.y,
      scale: 1,
      rotate: 0,
      transition: {
        delay: index * 0.1,
        duration: appearDuration,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    });
  }, [controls, position, index, appearDuration]);

  const handleHoverStart = () => {
    if (clickable && !isExpanding) {
      setIsHovered(true);
      if (hoverSoundRef.current) {
        hoverSoundRef.current.currentTime = 0;
        hoverSoundRef.current.play();
      }
      controls.start({
        scale: 1.2,
        transition: { type: 'spring', stiffness: 300, damping: 10 },
      });
    }
  };

  const handleHoverEnd = () => {
    if (!isExpanding) {
      setIsHovered(false);
      controls.start({
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 10 },
      });
    }
  };

  const handleClick = async () => {
    if (!clickable || isExpanding) return;

    setIsExpanding(true);

    if (popSoundRef.current) {
      popSoundRef.current.currentTime = 0;
      popSoundRef.current.play();
    }

    await controls.start({
      scale: 0,
      rotate: 90,
      x: -100,
      y: -500,
      opacity: 1, // Animate opacity to 1
      color: 'var(--bg-color)', // Use CSS variable directly
      backgroundColor: 'var(--bg-color)',
      transition: {
        duration: 1.2,
        ease: 'easeInOut',
      },
    });

    navigate(navRoute);
  };

  return (
    <>
      <motion.div
        className={`nav-bubble ${clickable ? 'clickable' : ''}`}
        initial={{
          opacity: 0,
          x: origin.x,
          y: origin.y,
          scale: 0.3,
          rotate: -360,
        }}
        animate={controls}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onClick={handleClick}
        style={{
          '--bubble-color': color,
          '--bubble-size': `${size}px`,
          '--bubble-z-index': isExpanding ? 999 : isHovered ? 998 : zIndex,
          '--bubble-cursor': clickable ? 'pointer' : 'default',
          '--bubble-pointer-events': isExpanding ? 'none' : 'auto',
          '--bubble-transform': `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <h>{title}</h>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </motion.div>

      <audio ref={popSoundRef} src={bubblePopSound} />
      <audio ref={hoverSoundRef} src={bubbleHoverSound} />
      <audio ref={appearSoundRef} src={bubbleAppearSound} />
    </>
  );
};

export default NavBubble;