import React, {useState} from "react";  
import { useNavigate } from 'react-router-dom';  
import { NavBar } from "../../shared/components/NavBar";   
import { postCreateClass } from "../services/post-create-class";
import { ChatSettings } from "../../shared/components/ChatSettings"; 
import { ClassSettings} from "../../shared/components/ClassSettings";
import { useCurrentUser } from "../../store/user-store";
import { useClass } from "../../store/class-store";
import { CanvasCodeSettings } from "../../shared/components/CanvasCodeSettings";
import { postCanvasCode } from "../services/post-canvas-code";


/**
 * CreateClassPage Component
 * This page allows teachers to create a new class by entering the class name.
 * It includes a title card, an input field for the class name, and a button to submit the class creation request, subject to change
 */

const CreateClassPage = () => {  
 
    // TODO: Add the functionality to create a class here 
    const [newClassName, setNewClassName] = useState(""); 
    const [selectedChatSetting, setSelectedChatSetting] = useState(null);
    const [newCanvasCode, setNewCanvasCode] = useState("");

    const { user } = useCurrentUser(); 
    const [, { fetchClasses, setCurrentClass } ] = useClass();  
    const navigate = useNavigate();


    const handleCreateClass = async (e) => {  
        e.preventDefault(); 

        if (newClassName === "") {
            alert("Please enter a class name.");
            return;
        }

        if (selectedChatSetting === null) {
            alert("Please select a chat setting.");
            return;
        }

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
            if (newCanvasCode !== "") {
                await postCanvasCode(response.data.id, newCanvasCode);
            }



            navigate('/unitpage');
            
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

    const handleCanvasCodeChange = (canvasCode) => {
        setNewCanvasCode(canvasCode);
    }; 



    return(  
        <>  
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 bg-[length:200%_200%]" style={{animation: 'gradient-shift 15s ease-in-out infinite'}}>
            <NavBar title={"Create a Class"} />
            
            <div className="max-w-2xl mx-auto mt-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">

                    <form onSubmit={handleCreateClass} className="space-y-8">
                        <ClassSettings 
                            onClassNameChange={handleClassNameChange}
                        />

                        <ChatSettings 
                            onSettingsChange={handleSettingsChange}
                        /> 

                        <CanvasCodeSettings 
                            onCanvasCodeChange={handleCanvasCodeChange}
                        />

                        <div className="flex justify-center">
                            <button 
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg 
                                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                         focus:ring-blue-500 transition-colors duration-200 shadow-sm
                                         hover:shadow-md w-full sm:w-auto"
                            >
                                Create Class
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    ); 

}; 

export default CreateClassPage;