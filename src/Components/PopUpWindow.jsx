import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import '../styles/popup.css';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const PopUpWindow = ({
  isOpen,
  onClose,
  children,
  minWidth = '300px',
  minHeight = '300px',
  customStyles = {},
  blurIntensity = '4px',
}) => {
  const [dimensions, setDimensions] = useState({ width: minWidth, height: minHeight });
  const contentRef = useRef(null);

  // Dynamic sizing based on content
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const content = contentRef.current;
      const newWidth = `${content.scrollWidth + 20}px`; // Padding
      const newHeight = `${content.scrollHeight + 10}px`; // Padding for header
      setDimensions({
        width: newWidth,
        height: newHeight,
      });
    }
  }, [isOpen, children]);

  // Portal rendering
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error('modal-root element not found in DOM');
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="popup-container">
          <motion.div
            className="popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backdropFilter: `blur(${blurIntensity})`,
              WebkitBackdropFilter: `blur(${blurIntensity})`,
            }}
          />
          <motion.div
            className="popup-window"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: dimensions.width,
              height: dimensions.height,
              maxWidth: '90vw',
              maxHeight: '90vh',
              ...customStyles,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="popup-close"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="popup-content" ref={contentRef}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

PopUpWindow.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  minWidth: PropTypes.string,
  minHeight: PropTypes.string,
  customStyles: PropTypes.object,
  blurIntensity: PropTypes.string,
};

export default PopUpWindow;