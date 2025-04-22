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



const TeacherStudentModulePage = () => {     

    const [loading, setLoading] = useState(true); 
    const [modulesData, setModulesData] = useState(null);   

    const [isChatExpanded, setIsChatExpanded] = useState(false); 

    const [displayType, setDisplayType] = useState('welcome'); 
    const [selectedModule, setSelectedModule] = useState(null); 
    const [selectedDay, setSelectedDay] = useState(null);  
    const [selectedMaterialID, setSelectedMaterialID] = useState(null);   
    const [selectedMaterialName, setSelectedMaterialName] = useState(null); 
    const [selectedAssignmentID, setSelectedAssignmentID] = useState(null);  
    const [selectedAssignmentName, setSelectedAssignmentName] = useState(null);

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);


    const [dayMaterails, setDayMaterials] = useState(null); 
    const [materialContent, setMaterialContent] = useState(null); 
    const [assignmentContent, setAssignmentContent] = useState(null); 

    const [currentContentDisplay, setCurrentContentDisplay] = useState(null);

    const location = useLocation(); 
    const {unitID, unitName, userID, role} = location.state || {};  

    const chatImage = require("../../images/chat-message-dots.png");


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


    useEffect(() => { 

        const loadModules = async () => {  

            try {   
                const url = `/unit/${unitID}/modules`; 
                const response = await getRequest(url);  
                console.log(response.data);
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



    const handleDaySelect = async ( moduleID, dayID ) => {  
        setSelectedModule(moduleID); 
        setSelectedDay(dayID);
        setDisplayType('day'); 

        try {  
            const url = `/module/${moduleID}/days` 
            const response = await getRequest(url); 
            console.log("This is the response from /days module call", response.data.materials);
            setDayMaterials(response.data.materials); 
            
        } 
        catch (error) { 
            console.log(error);  
             
        }
 
    };    



    const handleAssignmentSelect = async (dayID, assignmentID, fileName, assignmentName) => { 

        setSelectedAssignmentID(assignmentID);   
        setSelectedAssignmentName(assignmentName);
        setDisplayType('assignment'); 
        console.log("This is the file name", fileName);

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


    }

    const handleMaterialSelect = async ( dayID, materialID, fileName, materialName ) => { 

        setSelectedMaterialID(materialID);  
        setSelectedMaterialName(materialName);
        setDisplayType('material'); 

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


    useEffect(() => { 
        if (displayType !== 'chat' && displayType !== 'chat-settings') { 
            setIsChatExpanded(false);  
        } 
    }, [displayType]);   


    const renderModules = () => { 
        if (!Array.isArray(modulesData)) { 
            return null;
        } 
        else {  

            return( 
                <> 
                <div className="module-container"> 
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

            <div className="sidebar-container"> 
                {renderModules()} 
            </div>  
            
            <div className="content-display-container"> 
                {renderContent()}
            </div>  

        

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