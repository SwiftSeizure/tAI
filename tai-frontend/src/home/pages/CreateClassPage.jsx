import React, {useState} from "react";  
import { useNavigate } from 'react-router-dom';  
import { NavBar } from "../../shared/components/NavBar";   
import { postCreateClass } from "../services/post-create-class";
import { ChatSettings } from "../../shared/components/ChatSettings"; 
import { ClassSettings} from "../../shared/components/ClassSettings";
import { useCurrentUser } from "../../store/user-store";
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
    const [, { fetchClasses, setCurrentClass } ] = useClass();  
    const navigate = useNavigate();


    const handleCreateClass = async (e) => {  
        e.preventDefault();

        try {  
            const requestBody = { 
                name: newClassName,
                settings: { 
                    chatSetting: selectedChatSetting
                }, 
                published: false
            };

            const response = await postCreateClass(user.id, requestBody); 
            // Will have to split this up into 2 once routes are implemented 
            await fetchClasses(user.id, user.role);
            await setCurrentClass(response.data.id); 
            navigate('/unitpage');

            // show class code if present in the response (try several common keys)
            //const classCode = response?.data?.classCode ?? response?.data?.code ?? response?.data?.class_code;
            const classCode = response.data.classCode;
            if (classCode) {
                alert(`Class code: ${classCode}`);
            } else {
                console.warn('CreateClassPage: class code not found in response', response);
            }
            
        }

        catch (error) { 
            console.log("Error creating class:", error); 
        }
    }; 

    const handleSettingsChange = (selectedSetting) => {
        setSelectedChatSetting(selectedSetting);
    };

    const handleClassNameChange = (className) => {
        setNewClassName(className);
    };



    return(  
        <>  
        <NavBar title={"Create a Class"} />
        
        <form onSubmit={handleCreateClass} className="flex flex-col items-center">

            <ClassSettings 
                onClassNameChange={handleClassNameChange}
            />

            <ChatSettings 
                onSettingsChange={handleSettingsChange}
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