import { useState } from 'react';
import PopUpWindow from './PopUpWindow';
import Login from '../pages/Login';
import AddTask from '../components/AddTask';
import EditTask from '../components/EditTask';
import RepeatPrompt from "../Components/RepeatPrompt";
import { bulkDelete } from './TaskHandlers'; // Import bulkDelete function
import UserAlert from '../components/UserAlert';
import ConfirmPopup from './ConfirmPopup';

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
const createPopup = (ChildComponent, popupName, configOverrides = {}, childProps) => {
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

    const handleClose = () => {
    if (props.onClose) props.onClose();
    closePopup();
    };

    const Component = () => (
      <PopUpWindow
        isOpen={isOpen}
        onClose={handleClose} // Pass closePopup to the PopUpWindow
        {...defaultPopupConfig}
        {...configOverrides}
      >
        <ChildComponent {...childProps} {...props} setIsOpen={setIsOpen} onClose={handleClose} />
      </PopUpWindow>
    );

    return { Component, trigger, isOpen };
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
export const UserAlertPopup = createPopup(
 UserAlert, 'UserAlert', {},  {message:"Felaktigt användarnamn eller lösenord!" });
 export const AllDonePopup = createPopup(
  UserAlert, 'UserAlert', {},  {message:"you have done everything for today!" });

 
 export const AlertPopupConfig = createPopup(UserAlert, 'AlertPopup')
export const ConfirmPopupConfig = createPopup(
  ConfirmPopup,
  'ConfirmPopup'
);

export const NoTaskFoundPopup = createPopup(
  UserAlert,
  'NoTaskFound',
  {},
  { message: "No task found." }
);
