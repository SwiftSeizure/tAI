import { useState, useEffect } from "react";  

const useUser = () => { 
    const [user, setUser] = useState(null); 

    // Set the user as teacher or student here 
    useEffect(() => { 
        const loggedInUser = localStorage.getItem("user"); 
        if (loggedInUser) { 
            setUser(JSON.parse(loggedInUser));
        }
    }, []); 
    return { user };
} 

export default useUser;