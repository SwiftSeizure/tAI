import React from 'react';  

export default function DeleteModal({ isOpen, onClose, onConfirmDelete, itemToDelete }) {  

    const handleConfirmDelete = () => {
        onConfirmDelete();
        onClose();
    }; 


    
    if (!isOpen) { 
        return null;
    } 
    
    return (
        <div>
            <h1>Delete Modal </h1>
            <p>Are you sure you want to delete {itemToDelete}?</p>
            <button onClick={handleConfirmDelete}>Delete</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
}
    