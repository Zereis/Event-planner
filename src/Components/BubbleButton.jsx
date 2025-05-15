import React, { useState, useEffect, useRef } from 'react';
import '../styles/bubbles.css';
import bubblePopSound from '../assets/sound/bubble-pop.mp3';
import bubbleHoverSound from '../assets/sound/bubble.mp3';
import bubbleAwaySound from '../assets/sound/bubble-away.mp3';

const BubbleButton = ({
  label = "",
  zoom = 1,
  toggle = false,
  toggleColor = "red",
  defaultColor = "transparent",
  hoverColor = "rgba(236, 38, 197, 0.856)",
  onClick = () => {},
  onToggleChange = () => {},
  pointerEvents = "auto",
  disabled = false,
  clickSound = bubblePopSound,
  hoverSound = bubbleHoverSound,
  clickAwaySound = bubbleAwaySound,
  ariaLabel = "",
  icon = null,
  isToggled: controlledToggled = null,
  setIsToggled: setControlledToggled = null,
  flyAway = false, // ✅ only fly away if true
}) => {
  const [internalToggled, setInternalToggled] = useState(false);
  const isControlled = controlledToggled !== null && typeof setControlledToggled === "function";
  const isToggled = isControlled ? controlledToggled : internalToggled;
  const setIsToggled = isControlled ? setControlledToggled : setInternalToggled;

  const [isFlying, setIsFlying] = useState(false);
  const [visible, setVisible] = useState(true);

  const clickAudio = useRef(null);
  const hoverAudio = useRef(null);

  const handleClick = () => {
    if (disabled || pointerEvents === "none") return;

    if (clickAudio.current) clickAudio.current.play();

    if (toggle) {
      const newState = !isToggled;
      setIsToggled(newState);
      onToggleChange(newState);
    }

    onClick();

    if (flyAway) {
      if (clickAwaySound) {
        const awayAudio = new Audio(clickAwaySound);
        awayAudio.play();
      }
      setIsFlying(true);
      setTimeout(() => setVisible(false), 2000); // match animation duration
    }
  };

  const handleMouseEnter = () => {
    if (hoverAudio.current) hoverAudio.current.play();
  };

  const customStyle = {
    backgroundColor: isToggled ? toggleColor : defaultColor,
    '--hover-bg': hoverColor,
    zoom,
    pointerEvents,
  };

  if (!visible) return null;

  return (
    <>
      {clickSound && <audio ref={clickAudio} src={clickSound} preload="auto" />}
      {hoverSound && <audio ref={hoverAudio} src={hoverSound} preload="auto" />}
      <div
        className={`bubble-button ${isToggled ? "toggled" : ""} ${isFlying ? "fly-away" : ""}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        style={customStyle}
        role="button"
        aria-label={ariaLabel || label}
        title={ariaLabel || label}
      >
        <div
          className="bubble-background"
          style={{ backgroundColor: isToggled ? toggleColor : defaultColor }}
        />
        <div className="bubble-effects-layer">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>
        {icon && <img src={icon} alt={label} className="bubble-icon" />}
        {label && <h1>{label}</h1>}
      </div>
    </>
  );
};

export default BubbleButton;
