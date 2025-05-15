import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, useAnimation } from 'framer-motion';
import bubblePopSound from '../assets/sound/bubble-pop.mp3';
import bubbleHoverSound from '../assets/sound/bubble.mp3';
import bubbleAppearSound from '../assets/sound/bubble-appears.mp3';
import '../styles/navbubble.css';

const BASE_SIZE = 250;

const NavBubble = ({
  title,
  color,
  hoverColor,
  navRoute,
  onClick,
  position,
  size,
  scale,
  textScale = 1,
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
  const hasAppeared = useRef(false); // Track initial appearance

  const popSoundRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const appearSoundRef = useRef(null);

  // Use scale or derive from size
  const effectiveScale = scale ?? (size ? size / BASE_SIZE : 1);
  const bubbleSizePx = `${BASE_SIZE}px`;

  // Initial appearance animation and sound
  useEffect(() => {
    // Play sound only on first appearance
    if (!hasAppeared.current && appearSoundRef.current) {
      appearSoundRef.current.currentTime = 0;
      appearSoundRef.current.play();
      hasAppeared.current = true;
    }

    controls.start({
      opacity: 1,
      x: position.x,
      y: position.y,
      scale: effectiveScale,
      rotate: 0,
      transition: {
        delay: index * 0.1,
        duration: appearDuration,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    });
  }, [controls, position, index, appearDuration, effectiveScale]);

  const handleHoverStart = () => {
    if (clickable && !isExpanding) {
      setIsHovered(true);
      if (hoverSoundRef.current) {
        hoverSoundRef.current.currentTime = 0;
        hoverSoundRef.current.play();
      }
      controls.start({
        scale: effectiveScale * 1.2,
        backgroundColor: hoverColor || color,
        transition: { type: 'spring', stiffness: 300, damping: 10 },
      });
    }
  };

  const handleHoverEnd = () => {
    if (!isExpanding) {
      setIsHovered(false);
      controls.start({
        scale: effectiveScale,
        backgroundColor: color,
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

    if (onClick) {
      // Popup animation: Pulse effect
      await controls.start({
        scale: [effectiveScale, effectiveScale * 1.3, effectiveScale],
        opacity: 1,
        x: position.x,
        y: position.y,
        backgroundColor: hoverColor || color,
        transition: {
          duration: 0.4,
          times: [0, 0.5, 1],
          ease: 'easeInOut',
        },
      });
      onClick(); // Trigger popup
      setIsExpanding(false); // Reset to allow clicking again
    } else if (navRoute) {
      // Navigation animation: Shrink and move
      await controls.start({
        scale: 0,
        rotate: 90,
        x: -100,
        y: -500,
        opacity: 1,
        backgroundColor: 'var(--bg-color)',
        transition: {
          duration: 1.2,
          ease: 'easeInOut',
        },
      });
      navigate(navRoute); // Navigate to route
    }
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
          rotate: -300,
        }}
        animate={controls}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onClick={handleClick}
        style={{
          width: bubbleSizePx,
          height: bubbleSizePx,
          transformOrigin: 'center',
          zIndex: isExpanding ? 999 : isHovered ? 998 : zIndex,
          backgroundColor: color,
          position: 'absolute',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: clickable ? 'pointer' : 'default',
        }}
      >
        <h3 style={{ fontSize: `${textScale}rem` }}>{title}</h3>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </motion.div>

      <audio ref={popSoundRef} src={bubblePopSound} />
      <audio ref={hoverSoundRef} src={bubbleHoverSound} />
      <audio ref={appearSoundRef} src={bubbleAppearSound} />
    </>
  );
};

export default NavBubble;