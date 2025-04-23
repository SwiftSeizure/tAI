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
        {/* Title card for the page */}
        < TitleCard 
        title="Join a Class" 
        /> 

        {/* Main content section for joining a class */}
        <div className="new-class-card">
            <h1 className="title-card-h1"> 
                Enter the class cose below to join a class.
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
        </>
    ); 

}; 

export default JoinClassPage;