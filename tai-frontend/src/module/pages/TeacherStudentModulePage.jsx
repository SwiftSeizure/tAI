// React & Dependencies
import React, { useEffect, useState } from "react";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Components
import { TitleCard } from "../../shared/components/TitleCard";
import ChatFeature from "../components/ChatFeature";
import ModuleComponent from "../components/ModuleComponent"; 
import PDFContent from "../components/PDFContent";

// Modals
import AddModuleModal from "../modals/AddModuleModal";   
import AddDayModal from "../modals/AddDayModal";
import AddAssignmentModal from "../modals/AddAssignmentModal"; 
import AddMaterialModal from "../modals/AddMaterialModal";
import DeleteModal from "../../shared/modals/DeleteModal";

// Store Hooks
import { useCurrentUser } from "../../store/user-store"; 
import { useCurrentUnit } from "../../store/unit-store";
import { useModule } from "../../store/module-store"; 
import { useCurrentChat } from "../../store/chat-store"; 
import { useContent } from "../../store/content-store";  
import { useDay } from "../../store/day-store"; 

// API Calls (Services)
import { postCreateModule } from "../services/post-create-module";
import { postCreateDay } from "../services/post-create-day";   
import { postCreateMaterial } from "../services/post-create-material"; 
import { postCreateAssignment } from "../services/post-create-assignment";  
import { getMaterialURL } from "../services/get-material-url";
import { sendChatMessage } from "../helper-methods/send-chat-message";
import { getAssignmentURL } from "../services/get-assignment-url";   
import { deleteModule } from "../services/delete-module"; 
import { deleteDay } from "../services/delete-day";
import { deleteMaterial } from "../services/delete-material";
import { deleteAssignment } from "../services/delete-assignment"; 

// Helper Methods

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

    // UI State
    const [isChatExpanded, setIsChatExpanded] = useState(false); // Tracks chat expansion state
    const [displayType, setDisplayType] = useState('welcome'); // Tracks the type of content to display
    const [chatWidth, setChatWidth] = useState(600); // Default width in pixels

    // Modal States
    const [showAddModuleModal, setShowAddModuleModal] = useState(false);
    const [showAddDayModal, setShowAddDayModal] = useState(false);
    const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
    const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
    const [showDeleteModuleModal, setShowDeleteModuleModal] = useState(false); 
    const [showDeleteDayModal, setShowDeleteDayModal] = useState(false); 
    const [showDeleteMaterialModal, setShowDeleteMaterialModal] = useState(false); 
    const [showDeleteAssignmentModal, setShowDeleteAssignmentModal] = useState(false); 

    // Module Management
    const [selectedModuleId, setSelectedModuleId] = useState(null);

    // Delete Module Management
    const [currentDeleteModule, setCurrentDeleteModule] = useState(null); 

    // Delete Day Management
    const [currentDeleteDay, setCurrentDeleteDay] = useState(null);  

    // Delete Material Management
    const [currentDeleteMaterial, setCurrentDeleteMaterial] = useState(null); 

    // Delete Assignment Management
    const [currentDeleteAssignment, setCurrentDeleteAssignment] = useState(null); 


    // Store Hooks 
    // User
    const { user } = useCurrentUser();
    // Unit
    const { currentUnit } = useCurrentUnit();
    // Module
    const [moduleState, moduleActions] = useModule();
    const { modules } = moduleState;
    const { fetchModules } = moduleActions; 
    // Chat
    const { setCurrentChat, addMessage, setLoading, setError } = useCurrentChat();
    // Content
    const [contentState, contentActions] = useContent();
    const { selectedContent, selectedContentURL } = contentState;
    const { setSelectedContent } = contentActions; 
    // Day
    const [dayStore, dayActions] = useDay();  
    const { selectedDay } = dayStore;
    const { setSelectedDay } = dayActions;

    
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
    const handleDaySelect =  async (day) => {    

        await setSelectedDay(day); 
        console.log("Selected day ID:", day.id);
        setDisplayType('day'); 
    };    


    /**
     * handleAssignmentSelect
     * Handles the selection of an assignment and fetches its content.
     * @param {number} dayID - The ID of the day containing the assignment.
     * @param {string} fileName - The filename of the assignment.
     * @param {string} assignmentName - The name of the assignment.
     */
    const handleAssignmentSelect = async (dayID, assignment) => {
        try { 

            const fileURL = await getAssignmentURL(dayID, assignment.filename); 
            await setSelectedContent(assignment, 'assignment', fileURL);
            setDisplayType('assignment');
            const chatId = `assignment_${assignment.id}`;
            setCurrentChat(chatId);

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
    const handleMaterialSelect = async ( dayID, material ) => {

        try {
            // Update the selected material and set the display type to 'material'
            const fileURL = await getMaterialURL(dayID, material.filename); 
            await setSelectedContent(material, 'material', fileURL); 

            setDisplayType('material');  

            const chatId = `material_${material.id}`;
            setCurrentChat(chatId);

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

    const handleAddMaterial = () => {
        setShowAddMaterialModal(true);
    };  

    const handleNewMaterial = async (materialData) => {
        try {  
            const formData = new FormData();
            formData.append('file', materialData.file);  

            const fileName = materialData.name;
            await postCreateMaterial(selectedDay.id, fileName, formData); 
             
            await fetchModules(currentUnit.id);  
            
            //force refresh here

            handleMaterialSelect(selectedDay.id, materialData.file.name, materialData.name); 
        } 
        catch (error) { 
            console.error('Error creating material:', error);
        }  
        setShowAddMaterialModal(false);
    }; 

    const handleAddAssignment = () => {
        setShowAddAssignmentModal(true);
    }; 
 
    const handleNewAssignment = async (assignmentData) => {
        try {  
            const formData = new FormData();
            formData.append('file', assignmentData.file);  

            const fileName = assignmentData.name;
            await postCreateAssignment(selectedDay.id, fileName, formData); 
             
            await fetchModules(currentUnit.id); 

            handleAssignmentSelect(selectedDay.id, assignmentData.filename, assignmentData.name); 
        } 
        catch (error) { 
            console.error('Error creating assignment:', error);
        }  

        setShowAddAssignmentModal(false);
    };   

    const handleChatMessage = async (message) => {
        return sendChatMessage({
            message,
            displayType,
            selectedContent,
            selectedDay,
            user,
            setCurrentChat,
            addMessage,
            setError,
            setLoading
        });
    };

    const handleOpenDeleteModuleModal = (module) => { 
        setCurrentDeleteModule(module);
        setShowDeleteModuleModal(true);
    };

    const handleCloseDeleteModuleModal = () => {
        setShowDeleteModuleModal(false);
    }; 

    const handleDeleteModule = async () => {
        try {
            await deleteModule(currentDeleteModule.id);
            await fetchModules(currentUnit.id);
        } catch (error) {
            console.error('Error deleting module:', error);
        }
        setShowDeleteModuleModal(false);
    };   

    const handleOpenDeleteDayModal = (day) => {
        setCurrentDeleteDay(day);
        setShowDeleteDayModal(true);
    };

    const handleCloseDeleteDayModal = () => {
        setShowDeleteDayModal(false);
    };

    const handleDeleteDay = async () => {
        try {
            await deleteDay(currentDeleteDay.id);
        } catch (error) {
            console.error('Error deleting day:', error);
        }
        setShowDeleteDayModal(false);
    }; 

    const handleOpenDeleteMaterialModal = (material) => {
        setCurrentDeleteMaterial(material);
        setShowDeleteMaterialModal(true);
    };

    const handleCloseDeleteMaterialModal = () => {
        setShowDeleteMaterialModal(false);
    };

    const handleDeleteMaterial = async () => {
        try { 
            console.log('Deleting material:', currentDeleteMaterial);  
            await deleteMaterial(currentDeleteMaterial.day_id, currentDeleteMaterial.filename);
            await fetchModules(currentUnit.id);
        } catch (error) {
            console.error('Error deleting material:', error);
        }
        setShowDeleteMaterialModal(false);
    }; 

    const handleOpenDeleteAssignmentModal = (assignment) => {
        setCurrentDeleteAssignment(assignment);
        setShowDeleteAssignmentModal(true);
    };

    const handleCloseDeleteAssignmentModal = () => {
        setShowDeleteAssignmentModal(false);
    };

    const handleDeleteAssignment = async () => {
        try {
            console.log('Deleting assignment:', currentDeleteAssignment); 
            await deleteAssignment(selectedDay.id, currentDeleteAssignment.filename);
            await fetchModules(currentUnit.id);
        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
        setShowDeleteAssignmentModal(false);
    };




    //Move 
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
    // End Move



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
                            onClickDeleteModule={handleOpenDeleteModuleModal}
                            onClickDeleteDay={handleOpenDeleteDayModal}
                            onClickDeleteMaterial={handleOpenDeleteMaterialModal}
                            onClickDeleteAssignment={handleOpenDeleteAssignmentModal}


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

                            {currentDeleteModule && (
                                <DeleteModal
                                    isOpen={showDeleteModuleModal}
                                    onClose={handleCloseDeleteModuleModal}
                                    onConfirmDelete={handleDeleteModule}
                                    itemToDelete={currentDeleteModule.name}
                                />
                            )}


                            {currentDeleteDay && (
                                <DeleteModal
                                    isOpen={showDeleteDayModal}
                                    onClose={handleCloseDeleteDayModal}
                                    onConfirmDelete={handleDeleteDay}
                                    itemToDelete={currentDeleteDay.name}
                                />
                            )} 

                            {currentDeleteMaterial && (
                                <DeleteModal
                                    isOpen={showDeleteMaterialModal}
                                    onClose={handleCloseDeleteMaterialModal}
                                    onConfirmDelete={handleDeleteMaterial}
                                    itemToDelete={currentDeleteMaterial.name}
                                />
                            )} 

                            {currentDeleteAssignment && (
                                <DeleteModal
                                    isOpen={showDeleteAssignmentModal}
                                    onClose={handleCloseDeleteAssignmentModal}
                                    onConfirmDelete={handleDeleteAssignment}
                                    itemToDelete={currentDeleteAssignment.name}
                                />
                            )}
                            
                        </div>
                    )}

                </div>
                </>
            )
        }
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
                                <h2 className="content-title"> {selectedContent.name} </h2> 
                            </div>
                            <PDFContent fileURL={selectedContentURL} />
                        </div>
                    );
     
            case 'assignment': 
                    return( 
                        <div className="content-container material-container"> 
                            <div className="content-header"> 
                                <h2 className="content-title"> {selectedContent.name} </h2> 
                            </div>  
                            <PDFContent fileURL={selectedContentURL} />

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
                       <h1 > Error loading this content </h1>
                       <p >An error occurred while loading this content, please try refreshing the page.</p>
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


                {/* Chat button for students */}
                {user.role === 'student' && !isChatExpanded && (
                    <button 
                        className="fixed bottom-4 right-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out z-50 bg-white shadow-lg hover:scale-110"  
                        onClick={toggleChatExpand} 
                        aria-label="Toggle chat"
                    > 
                        <img 
                            className="rounded-md transition-all duration-200 ease-in-out w-10 h-10 hover:w-12 hover:h-12"
                            src={chatImage}
                            alt="Chat"
                        /> 
                    </button>
                )}
            </div>

            {/* Chat panel for students */}
            {user.role === 'student' && isChatExpanded && (
                <div className="fixed right-0 top-0 h-full bg-white shadow-lg z-40 w-1/3 min-w-[400px]">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Chat</h3>
                            <button 
                                onClick={toggleChatExpand} 
                                className="text-gray-500 hover:text-gray-700 text-xl"
                                aria-label="Close chat"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <ChatFeature  
                                chatId={chatId}
                                displayType={displayType}
                                selectedContent={selectedContent}
                                onSendMessage={handleChatMessage}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    
        </>
    )

}; 

export default TeacherStudentModulePage;