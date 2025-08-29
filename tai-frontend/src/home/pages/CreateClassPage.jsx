import React, {useState} from "react";  
import { useNavigate } from 'react-router-dom';  
import { TitleCard } from "../../shared/components/TitleCard";   
import { postCreateClass } from "../services/post-create-class";
import { ChatSettings } from "../../shared/components/ChatSettings";
import { useCurrentUser } from "../../store/user-store";
import { useCurrentClass } from "../../store/class-store";
import { useClass } from "../../store/class-store";


/**
 * CreateClassPage Component
 * This page allows teachers to create a new class by entering the class name.
 * It includes a title card, an input field for the class name, and a button to submit the class creation request, subject to change
 */

const CreateClassPage = () => {  
 
    // TODO: Add the functionality to create a class here 
    const [newClassName, setNewClassName] = useState("");     
    const [selectedChatSetting, setSelectedChatSetting] = useState(null);
    
    const { user } = useCurrentUser(); 
    const [state, { fetchClasses, setCurrentClass } ] = useClass();  
    const navigate = useNavigate();


    const handleCreateClass = async (e) => {  
        e.preventDefault(); 

        try {  
            const requestBody = { 
                name: newClassName,
                settings: selectedChatSetting
            };

            const response = await postCreateClass(user.id, requestBody);
            await fetchClasses(user.id, user.role);
            await setCurrentClass(response.data.id); 
            navigate('/unitpage');
        }

        catch (error) { 
            console.log("Error creating class:", error); 
        }
    };



    return(  
        <>  
        <TitleCard title={"Create a Class"} />
        
        <form onSubmit={handleCreateClass} className="flex flex-col items-center">
            <input
                className="w-1/2 p-2 rounded border border-gray-300 text-base mb-2.5"
                id="className"
                type="text"
                placeholder="Enter Class Name"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
            /> 

            <ChatSettings 
                onSettingsChange={(selectedSetting) => setSelectedChatSetting(selectedSetting)}
            />

            <button 
                type="submit"
                className="inline-block w-[200px] cursor-pointer border-2 border-gray-300 rounded-lg p-4 m-2 bg-transparent
                         font-medium text-[1.1rem] text-gray-800 text-center font-nunito
                         transition-all duration-300 ease-in-out
                         hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg
                         active:-translate-y-0.5 active:shadow-md
                         focus:outline-none focus:outline-offset-2">
                Create Class
            </button>
        </form>
        </>
    ); 

}; 

export default CreateClassPage;