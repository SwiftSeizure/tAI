import React, { useState } from "react";
import { NavBar } from "../../shared/components/NavBar";  
import { useNavigate } from "react-router-dom"; 
import { postJoinClass } from "../services/post-join-class";
import { useClass } from "../../store/class-store";
import { useCurrentUser } from "../../store/user-store";

/**
 * JoinClassPage Component
 * This page allows students to join a class by entering a class code.
 * It includes a title card, an input field for the class code, and a button to submit the code.
 */

const JoinClassPage = () => {  

    // TODO: Add the functionality to join a class here  
    const [classCode, setClassCode] = useState(""); 
    const [, { fetchClasses, setCurrentClass } ] = useClass();   
    const { user } = useCurrentUser(); 
    const navigate = useNavigate();  

    const handleJoinClass = async (e) => { 
        e.preventDefault(); 

       try {
            const requestBody = {   
                studentID: user.id,
                classCode: classCode,
            } 
            const classID = await postJoinClass(requestBody);    
            console.log("Class ID:", classID); 
            await fetchClasses(user.id, user.role);
            await setCurrentClass(classID);
            console.log("Class joined successfully:", classCode); 
            navigate('/unitpage'); 
       } 
       catch (error) {  
            //TODO Add error message for user here 
            console.log("Error joining class:", error); 
       }
    };

    return(   
        <>  
        <NavBar title={"Join a Class"} /> 
        
        <form onSubmit={handleJoinClass} className="flex flex-col items-center">
            
            {/* Class Code Input Section - Styled like ClassSettings */}
            <div className="w-full max-w-2xl"> 
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 text-center">
                    Join Class
                </h3>
                
                <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enter the class code provided by your teacher to join the class.
                    </p>
                    
                    <div className="space-y-2">
                        <label
                            htmlFor="class-code-input"
                            className="block text-sm font-semibold text-gray-900 dark:text-white mb-1"
                        >
                            Class Code
                        </label>
                        <input
                            id="class-code-input"
                            type="text"
                            placeholder="Enter Class Code"
                            value={classCode}
                            onChange={(e) => setClassCode(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                                        dark:bg-gray-800 dark:text-white p-2.5 text-sm focus:ring-2 
                                        focus:ring-blue-500 focus:outline-none transition-all duration-200
                                        hover:border-gray-400 dark:hover:border-gray-500"
                            required
                        />
                    </div>
                </div>
            </div> 

            <div className="h-12"></div>

            <button 
                type="submit"
                className="inline-block w-[200px] cursor-pointer border-2 border-gray-300 rounded-lg p-4 m-2 bg-transparent
                         font-medium text-[1.1rem] text-gray-800 text-center font-nunito
                         transition-all duration-300 ease-in-out
                         hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg
                         active:-translate-y-0.5 active:shadow-md
                         focus:outline-none focus:outline-offset-2"
            >  
                Join Class
            </button>
        </form>
        </>
    ); 
}; 

export default JoinClassPage;