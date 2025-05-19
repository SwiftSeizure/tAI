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
        <div className="flex flex-col items-center justify-center p-5">
            <h1 className="text-3xl font-extrabold text-center mb-4 text-gray-900 font-nunito"> 
                Enter the name of the class you want to create below.
            </h1> 
            <input 
                className="w-1/2 p-2 rounded border border-gray-300 text-base mb-2.5" 
                id="className"
                type="text" 
                placeholder="Enter Class Name" 
            >   
            </input> 
            <button className="inline-block w-[200px] cursor-pointer border-2 border-gray-300 rounded-lg p-4 m-2 bg-transparent
                    font-medium text-[1.1rem] text-gray-800 text-center font-nunito
                    transition-all duration-300 ease-in-out
                    hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg
                    active:-translate-y-0.5 active:shadow-md
                    focus:outline-none focus:outline-offset-2">  
                Create Class
            </button> 
        </div>
        </>
    ); 

}; 

export default CreateClassPage;