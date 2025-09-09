import { useNavigate } from 'react-router-dom';     
import '../../styles/buttons.css';

export const AuthModal = ({isOpen, onClose, role, onAuthTrial}) => { 
    const navigate = useNavigate();  


    const handleLoginClick = () => { 
        onAuthTrial();
        
    };

    if (!isOpen) return null;
    
    return (
        <div>
            <h1>Auth Modal</h1>   
            <p>Role: {role}</p>
            <button 
                onClick={onClose}
                className="text-button-xxl"
            >
                Cancel
            </button> 

            <button 
                onClick={handleLoginClick}
                className="text-button text-button-xxl"
            >
                Login
            </button>
            
        </div>
    )
} 