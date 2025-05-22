import React from 'react';

export default function ConfirmPopup({ message, onClose, onConfirm }) {
  return (
    <div>
      <p>{message}</p>
      <button className="button" onClick={() => { onConfirm(); onClose(); }}>OK</button>
      <button className="button" onClick={onClose}>Cancel</button>
    </div>
  );
}