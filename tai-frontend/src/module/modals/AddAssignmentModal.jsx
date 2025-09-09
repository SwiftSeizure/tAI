import React, { useState, useEffect } from 'react';   

export default function AddAssignmentModal({ isOpen, onClose, onAddAssignment }) {    

    const [newAssignmentName, setNewAssignmentName] = useState('');  
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setNewAssignmentName('');
            setSelectedFile(null);
        }
    }, [isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Optionally set the assignment name from the filename
            if (!newAssignmentName) {
                setNewAssignmentName(file.name.split('.')[0]);
            }
        }
    };

    const handleAddAssignment = () => { 
        if (!newAssignmentName.trim()) return;
        
        const assignmentData = {
            name: newAssignmentName.trim(),
            file: selectedFile
        }; 

        console.log("Assignment Data in modal: ", assignmentData); 
        
        onAddAssignment(assignmentData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div>
            <div>
                <h2>Add Assignment</h2>
                <div>
                    <input 
                        type="text" 
                        placeholder="Assignment Name" 
                        value={newAssignmentName} 
                        onChange={(e) => setNewAssignmentName(e.target.value)}
                    /> 
                </div>
                <div>
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                        style={{ margin: '10px 0' }}
                    />
                    {selectedFile && (
                        <p>Selected file: {selectedFile.name}</p>
                    )}
                </div>
                <div>
                    <button 
                        onClick={handleAddAssignment}
                        disabled={!selectedFile}
                    >
                        Upload Assignment
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}