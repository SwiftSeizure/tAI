import React from "react"; 
import TitleCard from "../../components/TitleCard"; 
import buttons from "../../CSS/Buttons.css"; 
import "../../CSS/JoinClass.css";

/**
 * JoinClassPage Component
 * This page allows students to join a class by entering a class code.
 * It includes a title card, an input field for the class code, and a button to submit the code.
 */

const JoinClassPage = () => {  

    // TODO: Add the functionality to join a class here

    return(   

        <>  
        <div className="h-screen w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient"> 

        

            {/* Title card for the page */}
            < TitleCard 
            title="Join a Class"  
            intro={true}
            /> 

            {/* Main content section for joining a class */}
            <div className="new-class-card">
                <h1 className="title-card-h1"> 
                    Enter the class code below to join a class.
                </h1> 
                <input 
                    className="custom-input-standard" 
                    id="classCode"
                    type="text" 
                    placeholder="Enter Class Code" 
                >   
                </input> 
                <button className="custom-button-standard">  
                    Join Class
                </button> 
            </div> 

        </div>
        </>
    ); 

}; 

export default JoinClassPage;