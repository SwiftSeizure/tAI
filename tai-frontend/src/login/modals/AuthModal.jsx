import { useNavigate } from 'react-router-dom';    

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
            <button onClick={onClose}>Cancel</button> 

            <button onClick={handleLoginClick}>Login</button>
            
        </div>
    )
} 