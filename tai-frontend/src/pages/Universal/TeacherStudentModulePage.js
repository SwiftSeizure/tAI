import React, { useEffect, useState } from "react";  
import { useLocation } from "react-router-dom";
import TitleCard from "../../components/TitleCard";  
import { getRequest } from "../../API"; 
import axios from "axios";
import ChatFeature from "../../components/ChatFeature";
import ModuleComponent from "../../components/ModuleComponent"; 
import List from '@mui/material/List'; 
import buttons from "../../CSS/Buttons.css"  
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Document, Page } from 'react-pdf';     
import { BiBookOpen } from 'react-icons/bi';
import { RiChatSmile2Line } from 'react-icons/ri';  

import { pdfjs } from 'react-pdf';

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
    const [loading, setLoading] = useState(true); // Tracks loading state
    const [modulesData, setModulesData] = useState(null); // Stores module data  
    const [selectedModule, setSelectedModule] = useState(null); // Tracks the selected module
    const [isChatExpanded, setIsChatExpanded] = useState(false); // Tracks chat expansion state
    const [displayType, setDisplayType] = useState('welcome'); // Tracks the type of content to display
    
    const [selectedDay, setSelectedDay] = useState(null); // Tracks the selected day
    const [dayMaterials, setDayMaterials] = useState(null); // Stores materials for a selected day 
    const [selectedMaterialID, setSelectedMaterialID] = useState(null); // Tracks the selected material ID
    const [selectedMaterialName, setSelectedMaterialName] = useState(null); // Tracks the selected material name
    
    const [selectedAssignmentID, setSelectedAssignmentID] = useState(null); // Tracks the selected assignment ID
    const [selectedAssignmentName, setSelectedAssignmentName] = useState(null); // Tracks the selected assignment name
    
    const [numPages, setNumPages] = useState(null); // Tracks the number of pages in a PDF
    const [pageNumber, setPageNumber] = useState(1); // Tracks the current page number in a PDF
    
    const [materialContent, setMaterialContent] = useState(null); // Stores the content of a selected material
    const [assignmentContent, setAssignmentContent] = useState(null); // Stores the content of a selected assignment
    const [currentContentDisplay, setCurrentContentDisplay] = useState(null); // Tracks the current content being displayed

    // Retrieve user information from the location state
    const location = useLocation(); 
    const {unitID, unitName, userID, role} = location.state || {};  

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


    /**
     * useEffect Hook
     * Fetches module data when the component mounts or when `userID` or `role` changes.
     */
    useEffect(() => { 

        const loadModules = async () => {  

            try {   
                const url = `/unit/${unitID}/modules`; 
                const response = await getRequest(url);  
                setModulesData(response.data.modules);

            } 
            catch(error) {
              console.log(error)

            } 
            finally { 
                setLoading(false); 
            }
        }; 
        
        loadModules();

    }, [userID, role]);  


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

        // Fetch the materials and assignments for the selected day
        try {  
            const url = `/module/${moduleID}/days` 
            const response = await getRequest(url); 
            setDayMaterials(response.data.materials); 
        }  
        catch (error) { 
            console.log(error);  
        }
 
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
        try { 
            const url = `http://localhost:8000/assignment/${dayID}/${fileName}`;  
            const response = await axios.get(url, { responseType: 'blob' }); 
            const fileURL = URL.createObjectURL(response.data); 
            setAssignmentContent(fileURL); 
            setCurrentContentDisplay('assignment');
        } 
        catch (error) { 
            console.log(error)
        }
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
        try { 
            const url = `http://localhost:8000/material/${dayID}/${fileName}`; 
            const response =  await axios.get(url, {  responseType: 'blob' }); 
            const fileURL = URL.createObjectURL(response.data); 
            setMaterialContent(fileURL);  
            setCurrentContentDisplay('material');
        } 
        catch (error) { 
            console.log(error);
        }

    }
 

    /**
     * renderModules
     * Renders the list of modules as `ModuleComponent` components.
     */
    const renderModules = () => { 
        if (!Array.isArray(modulesData)) { 
            return null;
        } 
        else {  

            return( 
                <> 
                <div className="module-container">  
                    {/* Map all of the module components to the ModulePage */}
                    <h1 className="modules-heading"> {unitName} Modules</h1> 
                    {modulesData.map (module => ( 
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
                    <div className="chat-settings-container">  
                        <h1 className="chat-settings-heading"> Teacher Chat Settings </h1> 
                        <button 
                            className="chat-settings-radio-button"
                            type="radio"
                             name="doNotGiveAnswers" 
                             value="true" 
                        >  
                            Do not provide answers to students
                        </button>

                        
                    </div>
                );

            default: 
                return( 
                    <div className="empty-state-container">  
                        <h1 className="empty-state-container"> Select content to display </h1>
                    </div>
                )
        }
    };


    return(  
        <>   
        
        <TitleCard title={unitName} /> 

        <div className="modulepage-layout-grid">  

            {/* Sidebar for modules */}
            <div className="sidebar-container"> 
                {renderModules()} 
            </div>  
            
            {/* Main content area for displaying selected module content */}
            <div className="content-display-container"> 
                {renderContent()}
            </div>  

        
            {/* Chat button for students or chat settings for teachers */}
            {role === 'student' ? 
                <button 
                    className="custom-button-chat"  
                    onClick={toggleChatExpand} > 
                   <img 
                    className="custom-button-chat-image"  
                    src={chatImage}
                    /> 
               </button>  
               : 
               <button 
                    className="custom-button-chat"  
                    onClick={toggleChatExpand}  

                > 
                    {isChatExpanded ? "Save" : "Edit Chat Settings"} 

                </button> 
            } 

        </div> 
        
        </>
    )

}; 

export default TeacherStudentModulePage;