import React from "react"; 
import TitleCard from "../../components/TitleCard"; 

/**
 * CreateClassPage Component
 * This page allows teachers to create a new class by entering the class name.
 * It includes a title card, an input field for the class name, and a button to submit the class creation request, subject to change
 */

const CreateClassPage = () => {  
 
    // TODO: Add the functionality to create a class here

    return(  
        <>  
        <TitleCard title={"Create a Class"} />

        {/* Main content section for creating a class */}
        <div className="new-class-card">
            <h1 className="title-card-h1"> 
                Enter the name of the class you want to create below.
            </h1> 
            <input 
                className="custom-input-standard" 
                id="className"
                type="text" 
                placeholder="Enter Class Code" 
            >   
            </input> 
            <button className="custom-button-standard">  
                Create Class
            </button> 
        </div>
        </>
    ); 

}; 

export default CreateClassPage;