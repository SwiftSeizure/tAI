import React, { useState, useEffect } from 'react';  

export default function AddAssignmentModal({ isOpen, onClose, onAddAssignment }) {   
    
    const [newAssignmentName, setNewAssignmentName] = useState('');  

    const [assignment, setAssignment] = useState({});

    useEffect(() => {
        if (isOpen) {
            setNewAssignmentName('');
        }
    }, [isOpen]);

    const handleAddAssignment = () => { 
        if (!newAssignmentName.trim()) return; // Prevent empty assignment names
        onAddAssignment(newAssignmentName.trim());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div >
            <div >
                <h2>Add Assignment in Modal</h2>
                <input 
                    type="text" 
                    placeholder="Assignment Name" 
                    value={newAssignmentName} 
                    onChange={(e) => setNewAssignmentName(e.target.value)}
                /> 
                <div >
                    <button onClick={handleAddAssignment}>Add Assignment</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}