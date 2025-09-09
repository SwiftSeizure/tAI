import React, { useState, useEffect } from 'react';   

export default function AddMaterialModal({ isOpen, onClose, onAddMaterial }) {    

    const [newMaterialName, setNewMaterialName] = useState('');  
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setNewMaterialName('');
            setSelectedFile(null);
        }
    }, [isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Optionally set the assignment name from the filename
            if (!newMaterialName) {
                setNewMaterialName(file.name.split('.')[0]);
            }
        }
    };

    const handleAddMaterial = () => { 
        if (!newMaterialName.trim()) return;
        
        const materialData = {
            name: newMaterialName.trim(),
            file: selectedFile
        }; 

        console.log("Material Data in modal: ", materialData); 
        
        onAddMaterial(materialData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div>
            <div>
                <h2>Add Material</h2>
                <div>
                    <input 
                        type="text" 
                        placeholder="Material Name" 
                        value={newMaterialName} 
                        onChange={(e) => setNewMaterialName(e.target.value)}
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
                        onClick={handleAddMaterial}
                        disabled={!selectedFile}
                    >
                        Upload Material
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}