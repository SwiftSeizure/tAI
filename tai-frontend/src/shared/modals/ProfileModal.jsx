
export default function ProfileModal({ isOpen, onClose, onChangeDisplayName }) {  

    if (!isOpen) { 
        return null;
    }

    return (
        <div>
            <h2>Profile</h2>
            <button onClick={onClose}>Close</button>
        </div>
    );
    
};
	