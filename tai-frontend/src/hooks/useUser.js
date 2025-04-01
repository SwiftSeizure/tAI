import { useState, useEffect } from "react";  

const useUser = () => { 
    const [user, setUser] = useState(null);  
    const [isLoading, setIsLoading] = useState(true);

    // Set the user as teacher or student here 
    useEffect(() => { 
        const loggedInUser = localStorage.getItem("user"); 
        if (loggedInUser) { 
            setUser(JSON.parse(loggedInUser)); 
            setIsLoading(false);
        }
    }, []); 
    return { user, isLoading };
} 

export default useUser;