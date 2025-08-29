import React, { useState } from "react";  
import axios from "axios";
import { TitleCard } from "../../shared/components/TitleCard";  
import { useNavigate, useLocation } from "react-router-dom"; 
import { postJoinClass } from "../services/post-join-class";
import { useCurrentClass, useClass } from "../../store/class-store";
import { useCurrentUser } from "../../store/user-store";

/**
 * JoinClassPage Component
 * This page allows students to join a class by entering a class code.
 * It includes a title card, an input field for the class code, and a button to submit the code.
 */

const JoinClassPage = () => {  

    // TODO: Add the functionality to join a class here  
    const [classCode, setClassCode] = useState(""); 
    const { setCurrentClass, fetchClasses } = useCurrentClass(); 
    const { currentClass } = useClass(); 
    const { user } = useCurrentUser(); 
    const navigate = useNavigate();  

    const handleJoinClass = async (e) => { 
        e.preventDefault(); 

       try {   
            console.log(user); 
            const code = parseInt(classCode, 10); 
            console.log("This is the classID in the URL Param code: ", code); 
            const requestBody = {   
                studentID: user.id,
                classCode: code,
            } 
            console.log("This is the requestBody for joining a classroom: ", requestBody);  
            await postJoinClass(requestBody);   
            await fetchClasses(user.id); 
            await setCurrentClass(code);   
            navigate('/unitpage'); 
       } 
       catch (error) {  
            //TODO Add error message for user here 
            console.log("Error joining class:", error); 
       }
    };



    return(   

        <>  
        <div className="h-screen w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient"> 

            {/* Title card for the page */}
            < TitleCard 
            title="Join a Class"  
            intro={true}
            /> 

            {/* Main content section for joining a class */}
            <form onSubmit={ handleJoinClass } className="flex flex-col items-center justify-center p-5">
                <h1 className="text-3xl font-extrabold text-center mb-4 text-gray-900 font-nunito"> 
                    Enter the class code below to join a class.
                </h1> 
                <input 
                    className="w-1/2 p-2 rounded border border-gray-300 text-base mb-2.5" 
                    id="classCode"
                    type="text" 
                    placeholder="Enter Class Code"  
                    onChange={(e) => setClassCode(e.target.value)}
                >   
                </input> 
                <button className="inline-block w-[200px] cursor-pointer border-2 border-gray-300 rounded-lg p-4 m-2 bg-transparent
                    font-medium text-[1.1rem] text-gray-800 text-center font-nunito
                    transition-all duration-300 ease-in-out
                    hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg
                    active:-translate-y-0.5 active:shadow-md
                    focus:outline-none focus:outline-offset-2">  
                    Join Class
                </button> 
            </form> 

        </div>
        </>
    ); 

}; 

export default JoinClassPage;