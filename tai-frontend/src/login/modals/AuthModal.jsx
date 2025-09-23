import { auth, googleProvider } from "../../auth/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import React, { useState } from "react"; 


import { AUTH_TOGGLE } from "../../auth/auth-toggle"; 


export const AuthModal = ({isOpen, onClose, role, onAuthTrial}) => { 
   

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 


    const handleEmailLogin = async () => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password); 
            console.log(userCredentials); //TODO: DANGER DANGER DANGER remove this once auth works. 
            onAuthTrial();
        } catch (error) {
            console.error(error);
        }
    } 

    const handleGoogleLogin = async () => {
        try { 
            const result = await signInWithPopup(auth, googleProvider); 
            onAuthTrial();
        } catch (error) {
            console.error(error);
        }
        
    };

    const handleLoginClick = () => { 
        onAuthTrial();
        
    };

    if (!isOpen) return null;
    
    if ( AUTH_TOGGLE) {
        return (  
            <div>
                <h1>Auth Modal</h1>
                <h3> You are logging in as a {role}</h3>
                <div> 
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleEmailLogin}>Login</button>
                    <button onClick={handleGoogleLogin}>Login with Google</button> 
                    <button onClick={onClose}>Cancel</button>

                </div>
            </div>
        )
    }

    return (
        <div>
            <h1>Please Login </h1>   
            <p>Role: {role}</p>
            <button onClick={onClose}>Cancel</button> 

            <button onClick={handleLoginClick}>Login</button>
            
        </div>
    )
} 