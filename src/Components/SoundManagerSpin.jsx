import { useEffect, useRef } from "react";
import spinButton from "../assets/sound/spinButton.wav";
import spinning from "../assets/sound/spinning.wav";

const SoundManagerSpin = ({ playSpinButton, playSpinning }) => {
  const spinButtonAudio = useRef(null);
  const spinningAudio = useRef(null);

  useEffect(() => {
    spinButtonAudio.current = new Audio(spinButton);
    spinningAudio.current = new Audio(spinning);
  }, []);

  useEffect(() => {
    if (playSpinButton && spinButtonAudio.current) {
      spinButtonAudio.current.currentTime = 0;
      spinButtonAudio.current.play();
    }
  }, [playSpinButton]);

  useEffect(() => {
    if (playSpinning && spinningAudio.current) {
      spinningAudio.current.currentTime = 0;
      spinningAudio.current.play();
    }
  }, [playSpinning]);

  return null;
};

export default SoundManagerSpin;
