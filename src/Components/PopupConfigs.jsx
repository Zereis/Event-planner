import { useState } from 'react';
import PopUpWindow from './PopUpWindow';
import Login from '../pages/Login';
import AddTask from '../components/AddTask';
import EditTask from '../components/EditTask';
import RepeatPrompt from "../Components/RepeatPrompt";
import { bulkDelete } from './TaskHandlers'; // Import bulkDelete function

// Default popup configuration
const defaultPopupConfig = {
  minWidth: '300px',
  minHeight: '300px',
  customStyles: {
    background: 'linear-gradient(to bottom right, rgba(170, 180, 58, 1), rgba(8, 150, 175, 1))',
    color: '#ffffff',
    borderRadius: '16px',
  },
  blurIntensity: '2px',
};

// Factory function to create popup configurations
const createPopup = (ChildComponent, popupName, configOverrides = {}) => {
  return () => {
    const [isOpen, setIsOpen] = useState(false);
    const [props, setProps] = useState({}); // Store props for the popup

    const trigger = (popupProps = {}) => {
      console.log(`Triggering ${popupName} Popup`);
      setProps(popupProps); // Set the props for the popup
      setIsOpen(true);
    };

    const closePopup = () => {
      setIsOpen(false); // Close the popup
    };

    const Component = () => (
      <PopUpWindow
        isOpen={isOpen}
        onClose={closePopup} // Pass closePopup to the PopUpWindow
        {...defaultPopupConfig}
        {...configOverrides}
      >
        <ChildComponent {...props} onClose={closePopup} /> {/* Pass onClose to the child */}
      </PopUpWindow>
    );

    return { Component, trigger };
  };
};

// Popup configurations
export const LoginPopup = createPopup(Login, 'Login');
export const AddTaskPopup = createPopup(AddTask, 'AddTask');
// EditTaskPopup configuration
export const EditTaskPopup = createPopup(EditTask, 'EditTask', {
  minWidth: '500px',
  minHeight: '600px',
});