import React, { useState, useEffect } from 'react'; 

export default function AddDayModal({ isOpen, onClose, onAddDay }) {  

    const [newDayName, setNewDayName] = useState(''); 

    useEffect(() => {
        if (isOpen) {
            setNewDayName('');
        }
    }, [isOpen]);

    const handleAddDay = () => { 
        if (!newDayName.trim()) return; // Prevent empty day names
        onAddDay(newDayName.trim());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div >
            <div >
                <h2>Add Day in Modal</h2>
                <input 
                    type="text" 
                    placeholder="Day Name" 
                    value={newDayName} 
                    onChange={(e) => setNewDayName(e.target.value)}
                /> 
                <div >
                    <button onClick={handleAddDay}>Add Day</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}