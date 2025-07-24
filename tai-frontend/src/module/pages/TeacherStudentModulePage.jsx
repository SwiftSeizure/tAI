import React, { useEffect, useState } from "react";  
import { useLocation } from "react-router-dom";
import { TitleCard } from "../../shared/components/TitleCard";  
import { useModules } from "../hooks/useModules";
import ChatFeature from "../components/ChatFeature";
import ModuleComponent from "../components/ModuleComponent"; 
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import SettingsIcon from '@mui/icons-material/Settings';

import { pdfjs } from 'react-pdf';
import { getMaterialURL } from "../services/get-material-url";
import { getAssignmentURL } from "../services/get-assignment-url"; 

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;


/**
 * TeacherStudentModulePage Component
 * This page displays the modules, days, materials, and assignments for a specific unit.
 * It also includes a chat feature for students and chat settings for teachers.
 * 
 * Features:
 * - Displays a list of modules and their associated days.
 * - Allows users to view materials and assignments in a PDF viewer.
 * - Provides a chat feature for students and chat settings for teachers.
 * - Dynamically updates content based on user interactions.
 */

const TeacherStudentModulePage = () => {     

    // State variables for managing data and UI state
    // const [modulesData, setModulesData] = useState(null); // Stores module data  
    const [ , setSelectedModule] = useState(null); // Tracks the selected module
    const [isChatExpanded, setIsChatExpanded] = useState(false); // Tracks chat expansion state
    const [displayType, setDisplayType] = useState('welcome'); // Tracks the type of content to display
    
    const [, setSelectedDay] = useState(null); // Tracks the selected day
    const [, setSelectedMaterialID] = useState(null); // Tracks the selected material ID
    const [selectedMaterialName, setSelectedMaterialName] = useState(null); // Tracks the selected material name
    
    const [, setSelectedAssignmentID] = useState(null); // Tracks the selected assignment ID
    const [selectedAssignmentName, setSelectedAssignmentName] = useState(null); // Tracks the selected assignment name
    
    
    const [materialContent, setMaterialContent] = useState(null); // Stores the content of a selected material
    const [assignmentContent, setAssignmentContent] = useState(null); // Stores the content of a selected assignment
    const [currentContentDisplay, setCurrentContentDisplay] = useState(null); // Tracks the current content being displayed

    // Retrieve user information from the location state
    const location = useLocation(); 
    const {unitID, unitName, userID, role} = location.state || {};  

    // State to store the list of modules fetched from the backend
    const { modules, isLoading, error } = useModules(unitID);  
   

    const chatImage = require("../../images/chat-message-dots.png"); 


    /**
     * toggleChatExpand
     * Toggles the chat expansion state and updates the display type based on the user's role.
     */
    const toggleChatExpand = () => {
        setIsChatExpanded(!isChatExpanded);  

        if (!isChatExpanded && role === "student") { 
            setDisplayType('chat') 
        } 
        else if (!isChatExpanded && role === "teacher") { 
            setDisplayType('chat-settings'); 
        }  

        if (isChatExpanded) { 
            setDisplayType(currentContentDisplay);
        }
    };



    /*  
     */
    useEffect(() => { 
        if (displayType !== 'chat' && displayType !== 'chat-settings') { 
            setIsChatExpanded(false);  
        } 
    }, [displayType]);  


    /**
     * handleDaySelect
     * Handles the selection of a day within a module and fetches its materials.
     * @param {number} moduleID - The ID of the selected module.
     * @param {number} dayID - The ID of the selected day.
     */
    const handleDaySelect = async ( moduleID, dayID ) => {   

        // Update the selected module and day, and set the display type to 'day'
        setSelectedModule(moduleID); 
        setSelectedDay(dayID);
        setDisplayType('day'); 
    };    


    /**
     * handleAssignmentSelect
     * Handles the selection of an assignment and fetches its content.
     * @param {number} dayID - The ID of the day containing the assignment.
     * @param {number} assignmentID - The ID of the selected assignment.
     * @param {string} fileName - The filename of the assignment.
     * @param {string} assignmentName - The name of the assignment.
     */
    const handleAssignmentSelect = async (dayID, assignmentID, fileName, assignmentName) => { 

        // Update the selected assignment and set the display type to 'assignment'
        setSelectedAssignmentID(assignmentID);   
        setSelectedAssignmentName(assignmentName);
        setDisplayType('assignment'); 

        // Fetch the content of the selected assignment
        const fileURL = await getAssignmentURL(dayID, fileName); 
        setAssignmentContent(fileURL); 
        setCurrentContentDisplay('assignment');
    };


    /**
     * handleMaterialSelect
     * Handles the selection of a material and fetches its content.
     * @param {number} dayID - The ID of the day containing the material.
     * @param {number} materialID - The ID of the selected material.
     * @param {string} fileName - The filename of the material.
     * @param {string} materialName - The name of the material.
     */
    const handleMaterialSelect = async ( dayID, materialID, fileName, materialName ) => { 

        // Update the selected material and set the display type to 'material'
        setSelectedMaterialID(materialID);  
        setSelectedMaterialName(materialName);
        setDisplayType('material'); 

        // Fetch the content of the selected material
        const fileURL = await getMaterialURL(dayID, fileName);
        setMaterialContent(fileURL);  
        setCurrentContentDisplay('material');

    }
 

    /**
     * renderModules
     * Renders the list of modules as `ModuleComponent` components.
     */
    const renderModules = () => { 
        if (!Array.isArray(modules)) { 
            return null;
        } 
        else {  

            return( 
                <> 
                <div>  
                    {/* Map all of the module components to the ModulePage */}
                    <h1 className="modules-heading"> {unitName} Modules</h1> 
                    {modules.map (module => ( 
                        <ModuleComponent 
                            key={module.id} 
                            module={module} 
                            onDaySelect={handleDaySelect}  
                            onMaterialSelect={handleMaterialSelect} 
                            onAssignmentSelect={handleAssignmentSelect}
                        />
                    ))}    

                </div>
                </>
            )
        }
    };   



    /**
     * renderPDFContent
     * Renders a PDF viewer for the given file URL.
     * @param {string} fileURL - The URL of the PDF file to display.
     */
    const renderPDFContent = (fileURL) => {
        return (
            <div className="pdf-container" style={{ width: '100%', height: '600px' }}>
                <iframe 
                    src={fileURL} 
                    width="100%" 
                    height="100%" 
                    title="PDF Viewer"
                    style={{ border: 'none' }}
                />
            </div>
        );
    };


    /**
     * renderContent
     * Renders the content based on the current display type (e.g., welcome, material, assignment, chat).
     */
    const renderContent = () => { 
        switch(displayType) { 
            case 'welcome': 
                return(  
                    <div className="welcome-container">  
                        <h1 className="welcome-heading">Welcome to {unitName}</h1>
                        <p className="welcome-text"> Select a module and day from the menu to view materials and assignments. </p>
                    </div>
                    
                );  
                case 'material': 
                    return (
                        <div className="content-container material-container"> 
                            <div className="content-header">   
                                <h2 className="content-title"> {selectedMaterialName} </h2> 
                            </div>
                            {renderPDFContent(materialContent)} 
                        </div>
                    );
     
            case 'assignment': 
                    return( 
                        <div className="content-container material-container"> 
                            <div className="content-header"> 
                                <h2 className="content-title"> {selectedAssignmentName} </h2> 
                            </div>  
                            {renderPDFContent(assignmentContent)}

                        </div>
                    );
                    

            case 'chat':  
                return(  
                    <div className="chat-container"> 
                        <ChatFeature />
                    </div>
                    
                );   

            case 'chat-settings': 

                return( 
                    <div className="min-h-max flex flex-col">  
                        <h1 className="font-nunito font-bold text-2xl text-[#2c3e50] mb-4">
                            Teacher Chat Settings 
                        </h1> 
                        <button 
                            className="block relative w-fit cursor-pointer border-2 border-[#e0e0e0] rounded-lg p-4 m-2 font-nunito font-bold text-[#2c3e50]
                            transition-all duration-300 ease-in-out
                            hover:border-[#a0a0a0] hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(0,0,0,0.1)]
                            checked:border-[#66b2ff] checked:bg-blue-300
                            focus:outline-none focus:border-[#66b2ff]"
                            inputTtype="radio"
                            name="do-not-provide-answers-button" 
                            value="true" 
                        >  
                            Do not provide answers to students
                        </button>

                        
                    </div>
                );

            default: 
                return( 
                    <div className="welcome-container">  
                        <h1 className="welcome-heading">Welcome to {unitName}</h1>
                        <p className="welcome-text"> Select a module and day from the menu to view materials and assignments. </p>
                    </div>
                )
        }
    };


    return(  
        <>   
        <div className="h-screen w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient">
            
            <TitleCard title={unitName} /> 

            <div className="grid grid-cols-[280px_1fr_auto] gap-5 p-5 relative h-[calc(90vh-90px)] max-w-full overflow-x-hidden">  

                {/* Sidebar for modules */}
                <div className="bg-white rounded-lg shadow-md p-4 overflow-auto"> 
                    {renderModules()} 
                </div>  

                {/* Main content area for displaying selected module content */}
                <div className="bg-white rounded-lg shadow-md p-4 overflow-auto"> 
                    {renderContent()}
                </div>  


                {/* Chat button for students or chat settings for teachers */}
                {role === 'student' ? 
                    <button 
                        className="fixed bottom-4 right-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out "  
                        onClick={toggleChatExpand} > 
                       <img 
                        className={`rounded-md transition-all duration-300 ease-in-out ${isChatExpanded ? "w-12 h-12" : "w-8 h-8 hover:w-12 hover:h-12"}`}
                        src={chatImage}
                        /> 
                   </button>  
                   : 
                   <button 
                   className="fixed bottom-4 right-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out " 
                        onClick={toggleChatExpand}  

                    >  
                        <h2 className={`rounded-md transition-all duration-300 ease-in-out ${isChatExpanded ? "bg-red-600 p-2 fixed bottom-8 right-12 font-nunito" : "w-8 h-8 hover:w-12 hover:h-12"  }  `}>  
                            {isChatExpanded ? "Save Changes" : <SettingsIcon />} 
                        </h2>
                        

                    </button> 
                } 
            </div>  
        </div>
    
        </>
    )

}; 

export default TeacherStudentModulePage;