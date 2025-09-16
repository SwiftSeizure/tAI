import React, { useEffect, useState } from "react";   
import { useNavigate } from 'react-router-dom';  
import { TitleCard } from "../../shared/components/TitleCard";
import ChatFeature from "../components/ChatFeature";
import ModuleComponent from "../components/ModuleComponent";  
import AddModuleModal from "../modals/AddModuleModal";   
import AddDayModal from "../modals/AddDayModal"; 
import { useCurrentUser } from "../../store/user-store"; 
import { useCurrentUnit } from "../../store/unit-store";
import { useModule } from "../../store/module-store"; 
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import SettingsIcon from '@mui/icons-material/Settings'; 
import { postCreateModule } from "../services/post-create-module";
import { postCreateDay } from "../services/post-create-day";   
import { postCreateMaterial } from "../services/post-create-material"; 
import { postCreateAssignment } from "../services/post-create-assignment";  
import { putChatMessage } from "../services/put-chat-message"; 
import AddAssignmentModal from "../modals/AddAssignmentModal"; 
import AddMaterialModal from "../modals/AddMaterialModal"; 

import { pdfjs } from 'react-pdf';
import { getMaterialURL } from "../services/get-material-url";
import { getAssignmentURL } from "../services/get-assignment-url";   

import DeleteModal from "../../shared/modals/DeleteModal";
import { deleteModule } from "../services/delete-module";

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
    const [displayType, setDisplayType] = useState('welcome'); // Tracks the typeof content to display

    
    const [selectedDay, setSelectedDay] = useState(null); // Tracks the selected day

    const [selectedMaterialName, setSelectedMaterialName] = useState(null); // Tracks the selected material name
    
    const [selectedAssignmentName, setSelectedAssignmentName] = useState(null); // Tracks the selected assignment name
    const [fileName, setFileName] = useState(null);

    
    const [materialContent, setMaterialContent] = useState(null); // Stores the content of a selected material
    const [assignmentContent, setAssignmentContent] = useState(null); // Stores the content of a selected assignment
    const [currentContentDisplay, setCurrentContentDisplay] = useState(null); // Tracks the current content being displayed

    const [chatWidth, setChatWidth] = useState(600); // Default width in pixels

    const { user } = useCurrentUser(); 
    
    const studentID = user.id;
    const { currentUnit } = useCurrentUnit();  
    const [state, actions] = useModule();
    const { modules, isLoading, error } = state;
    const { fetchModules } = actions; 

    // State variables for managing the add module modal
    const [showAddModuleModal, setShowAddModuleModal] = useState(false);
    const [showAddDayModal, setShowAddDayModal] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState(null);  

    const [showAddMaterialModal, setShowAddMaterialModal] = useState(false); 
    const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);  

    const [chatResponse, setChatResponse] = useState('Response will appear here ');

    const [dayId, setDayId] = useState(null); 

    // This is for the Module Only 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentDeleteModuleID, setCurrentDeleteModuleID] = useState(null);  
    const [currentDeleteModuleName, setCurrentDeleteModuleName] = useState(null); 

    // Fetch modules when the component mounts or when currentUnit changes 
    useEffect(() => {
        fetchModules(currentUnit.id);
    }, [currentUnit?.id, fetchModules]);

    const chatImage = require("../../images/chat-message-dots.png");  

    /**
     * toggleChatExpand
     * Toggles the chat expansion state and updates the display type based on the user's role.
     */
    const toggleChatExpand = () => {
        setIsChatExpanded(!isChatExpanded);  
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
     * @param {string} fileName - The filename of the assignment.
     * @param {string} assignmentName - The name of the assignment.
     */
    const handleAssignmentSelect = async (dayID, fileName, assignmentName) => {
        try { 
            // Update the selected assignment and set the display type to 'assignment'
            setFileName(fileName);

            setSelectedMaterialName(null);
            setSelectedAssignmentName(assignmentName);
            setDisplayType('assignment'); 
            setDayId(dayID);

            // Fetch the content of the selected assignment
            const fileURL = await getAssignmentURL(dayID, fileName); 
            setAssignmentContent(fileURL); 
            setCurrentContentDisplay('assignment'); 
        } catch (error) {
            console.error('Error fetching assignment:', error);
            setDisplayType('error'); 
        }
    };


    /**
     * handleMaterialSelect
     * Handles the selection of a material and fetches its content.
     * @param {number} dayID - The ID of the day containing the material.
     * @param {string} fileName - The filename of the material.
     * @param {string} materialName - The name of the material.
     */
    const handleMaterialSelect = async ( dayID, fileName, materialName ) => {   

        console.log(dayID, "fileName", fileName, "materialName", materialName);

        try {
            setFileName(fileName);

            // Update the selected material and set the display type to 'material'
            setSelectedAssignmentName(null);
            setSelectedMaterialName(materialName);
            setDisplayType('material');  
            setDayId(dayID);

            // Fetch the content of the selected material
            const fileURL = await getMaterialURL(dayID, fileName);
            setMaterialContent(fileURL);  
            setCurrentContentDisplay('material'); 
        } catch (error) {
            setDisplayType('error'); 
        }

    }  

    const handleNewModule = async (newModalName) => {  
        try { 
            const settings = {};
            await postCreateModule(currentUnit.id, newModalName, settings);
            await fetchModules(currentUnit.id);
        } 
        catch (error) { 
            console.error('Error creating module:', error);
        } 
        setShowAddModuleModal(false); 
    } 

    const handleAddDay = (moduleId) => {
        setSelectedModuleId(moduleId);
        setShowAddDayModal(true);
    };

    const handleNewDay = async (dayName) => {
        try { 
            await postCreateDay(selectedModuleId, dayName);
            await fetchModules(currentUnit.id);
        } 
        catch (error) { 
            console.error('Error creating day:', error);
        } 
        setShowAddDayModal(false);
    }; 

    const handleAddMaterial = (dayId) => {
        setDayId(dayId);
        setShowAddMaterialModal(true);
    };  

    const handleNewMaterial = async (materialData) => {
        try {  
            const formData = new FormData();
            formData.append('file', materialData.file);  

            const fileName = materialData.name;
            await postCreateMaterial(dayId, fileName, formData); 
             
            await fetchModules(currentUnit.id);  
            
            //force refresh here 

            handleMaterialSelect(dayId, materialData.file.name, materialData.name); 
        } 
        catch (error) { 
            console.error('Error creating material:', error);
        }  
        setShowAddMaterialModal(false);
    }; 

    const handleAddAssignment = (dayId) => {
        setDayId(dayId);
        setShowAddAssignmentModal(true);
    }; 
 
    const handleNewAssignment = async (assignmentData) => {
        try {  
            const formData = new FormData();
            formData.append('file', assignmentData.file);  

            const fileName = assignmentData.name;
            await postCreateAssignment(dayId, fileName, formData); 
             
            await fetchModules(currentUnit.id); 

            handleAssignmentSelect(dayId, assignmentData.file.name, assignmentData.name); 
        } 
        catch (error) { 
            console.error('Error creating assignment:', error);
        }  

        setShowAddAssignmentModal(false);
    };   


    const handleOpenDeleteModal = (moduleID, moduleName) => {
        setCurrentDeleteModuleID(moduleID);
        setCurrentDeleteModuleName(moduleName);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    }; 

    const handleDeleteModule = async () => {
        try {
            await deleteModule(currentDeleteModuleID);
            await fetchModules(currentUnit.id);
        } catch (error) {
            console.error('Error deleting module:', error);
        }
        setShowDeleteModal(false);
    };

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
                    <h1 className="modules-heading"> {currentUnit?.name } Modules</h1> 
                    {modules.map (module => ( 
                        <ModuleComponent 
                            key={module.id} 
                            module={module} 
                            onDaySelect={handleDaySelect}  
                            onMaterialSelect={handleMaterialSelect} 
                            onAssignmentSelect={handleAssignmentSelect}
                            onAddDay={handleAddDay}
                            onAddMaterial={handleAddMaterial}
                            onAddAssignment={handleAddAssignment}  
                            onClickDelete={handleOpenDeleteModal}

                        />
                    ))}      
                    {user.role === "teacher" && (
                        <div>
                            <button onClick={() => setShowAddModuleModal(true)}>Add Module</button>
                            <AddModuleModal 
                                isOpen={showAddModuleModal}
                                onClose={() => setShowAddModuleModal(false)}
                                onAddModule={handleNewModule}
                            />
                            <AddDayModal
                                isOpen={showAddDayModal}
                                onClose={() => setShowAddDayModal(false)}
                                onAddDay={handleNewDay}
                            />
                            <AddMaterialModal
                                isOpen={showAddMaterialModal}
                                onClose={() => setShowAddMaterialModal(false)}
                                onAddMaterial={handleNewMaterial}
                            />
                            <AddAssignmentModal
                                isOpen={showAddAssignmentModal}
                                onClose={() => setShowAddAssignmentModal(false)}
                                onAddAssignment={handleNewAssignment}
                            /> 

                            <DeleteModal
                                isOpen={showDeleteModal}
                                onClose={handleCloseDeleteModal}
                                onConfirmDelete={handleDeleteModule}
                                itemToDelete={currentDeleteModuleName}
                            />
                        </div>
                    )}

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
                        <h1 className="welcome-heading">Welcome to {currentUnit?.name || 'Loading...'}</h1>
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

            case 'error': 
               return( 
                   <div > 
                       <h1 > Error loading {selectedMaterialName || selectedAssignmentName || 'content'} </h1>
                       <p >An error occurred while loading the material.</p>
                   </div>
               );

            default: 
                return( 
                    <div className="welcome-container">  
                        <h1 className="welcome-heading">Welcome to {currentUnit?.name || 'Loading...'}</h1>
                        <p className="welcome-text"> Select a module and day from the menu to view materials and assignments. </p>
                    </div>
                )
        }
    };

    /**
     * startResizing
     * Initiates the resizing of the chat overlay when the user starts dragging the resize handle.
     * @param {object} e - The mouse down event.
     */
    const startResizing = (e) => {
        // Prevent text selection while resizing
        e.preventDefault();

        // Add event listeners for mouse movement and release
        window.addEventListener("mousemove", resizeOverlay);
        window.addEventListener("mouseup", stopResizing);
    };

    const resizeOverlay = (e) => {
        // Calculate the total available width for the grid
        const totalWidth = window.innerWidth;

        // Calculate the maximum width for the chat overlay
        const maxChatWidth = totalWidth - 280; // Subtract the sidebar width (280px)

        // Calculate the new width based on the mouse position
        const newWidth = totalWidth - e.clientX;

        // Set a minimum and maximum width for the overlay
        if (newWidth >= 200 && newWidth <= maxChatWidth) {
            setChatWidth(newWidth);
        }
    };

    const stopResizing = () => {
        // Remove event listeners when resizing is complete
        window.removeEventListener("mousemove", resizeOverlay);
        window.removeEventListener("mouseup", stopResizing);
    };

    // Adjust chatWidth dynamically when the window is resized
    useEffect(() => {
        const handleResize = () => {
            const totalWidth = window.innerWidth;
            const maxChatWidth = totalWidth - 280;

            if (chatWidth > maxChatWidth) {
                setChatWidth(maxChatWidth);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [chatWidth]); 

    const handleChatMessageSend = async (message) => {  

        let currentFileName = null; 
        if(displayType === 'material') {
            currentFileName = selectedMaterialName;
        }
        else if(displayType === 'assignment') {
            currentFileName = selectedAssignmentName;
        }
        
        console.log("displayType", displayType, "dayId", dayId, "currentFileName", currentFileName, "message", message);  
        try {  
            if (currentFileName) {
                await putChatMessage(studentID,displayType, dayId, fileName, message);
            }
            else { 
                //Something about returning 
                await putChatMessage(studentID,displayType, dayId, message);
            }
        }
        catch (error) { 
            console.error('Error updating chat message:', error);
        }
    };

    const handleChatResponseReceived = (response) => {
        console.log(response); 
        setChatResponse(response);
    };

    return(  
        <>   
        <div className="h-screen w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient">
            
            <TitleCard title={currentUnit?.name || 'Loading...'} /> 

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
                {user.role === 'student' ? 
                    <button 
                        className="fixed bottom-4 right-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out z-50"  
                        onClick={toggleChatExpand} > 
                       <img 
                        className={`rounded-md transition-all duration-200 ease-in-out w-10 h-10 hover:w-16 hover:h-16`}
                        src={chatImage}
                        /> 
                   </button>  
                   : 
                   <button 
                   className="fixed bottom-4 right-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out "                        

                    >  
                        <h2 className={`rounded-md transition-all duration-300 ease-in-out ${isChatExpanded ? "bg-red-600 p-2 fixed bottom-8 right-12 font-nunito" : "w-8 h-8 hover:w-12 hover:h-12"  }  `}>  
                            {isChatExpanded ? "Save Changes" : <SettingsIcon />} 
                        </h2>
                        

                    </button> 
                } 
            </div>

            <div
              className={`fixed top-40 right-0 h-[calc(90vh-120px)] bg-white shadow-lg transition-transform duration-300 ease-in-out z-40 ${
                isChatExpanded ? "translate-x-0" : "translate-x-full"
                }`}
                // style={{ width: `${chatWidth}px` }} // Dynamically set the width
                style={{
                    width: `${chatWidth}px`, // Dynamically set the width
                    border: "5px solid #a5a5a5ff", // Add a border
                    borderRight: "none", // Remove the border on the right edge
                    borderRadius: "10px 0 0 10px", // Rounded edges on the top-left and bottom-left corners
                    // boxShadow: "inset 0 0 0 7px transparent, 0 0 0 7px linear-gradient(to bottom, #efcefcef, rgba(104, 96, 214, 1), #cf2)",
                }}
            >
                {/* Resize handle */}
                <div
                    className="absolute left-0 top-0 h-full w-2 cursor-ew-resize"
                    onMouseDown={startResizing}
                ></div>

                <ChatFeature 
                    onMessageSend={handleChatMessageSend} 
                    displayResponse={chatResponse}
                />
            </div>
        </div>
    
        </>
    )

}; 

export default TeacherStudentModulePage;