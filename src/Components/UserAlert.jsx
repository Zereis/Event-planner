import React from 'react'

export default function UserAlert({message, setIsOpen}) {
  const onClose = () => setIsOpen(false);

  return (
    <div>
      <p>{message}</p>
      <button 
      onClick={onClose}
      className='button'
      >
        Ok
      </button>
    </div>
  )
}


