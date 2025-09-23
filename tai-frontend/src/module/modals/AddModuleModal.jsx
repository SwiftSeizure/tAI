import React, { useState, useEffect } from 'react';

export default function AddModuleModal({ isOpen, onClose, onAddModule }) { 
    const [newModalName, setNewModalName] = useState(''); 

    // Reset the form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setNewModalName('');
        }
    }, [isOpen]);

    const handleAddModule = () => { 
        if (!newModalName.trim()) return; // Prevent empty module names
        onAddModule(newModalName.trim());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div >
            <div >
                <h2>Add Module in Modal</h2>
                <input 
                    type="text" 
                    placeholder="Module Name" 
                    value={newModalName} 
                    onChange={(e) => setNewModalName(e.target.value)}
                /> 
                <div >
                    <button onClick={handleAddModule}>Add Module</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}