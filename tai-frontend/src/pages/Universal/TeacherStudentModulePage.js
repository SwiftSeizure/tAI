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

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;



const TeacherStudentModulePage = () => {     

    const [loading, setLoading] = useState(true); 
    const [modulesData, setModulesData] = useState(null);   

    const [isChatExpanded, setIsChatExpanded] = useState(false); 

    const [displayType, setDisplayType] = useState('welcome'); 
    const [selectedModule, setSelectedModule] = useState(null); 
    const [selectedDay, setSelectedDay] = useState(null);  
    const [selectedMaterial, setSelectedMaterial] = useState(null);  
    const [selectedAssignment, setSelectedAssignment] = useState(null); 

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



    const handleAssignmentSelect = async (dayID, assignmentID, fileName) => { 

        setSelectedAssignment(assignmentID);  
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

    const handleMaterialSelect = async ( dayID, materialID, fileName ) => { 


        setSelectedMaterial(materialID); 
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
                {modulesData.map (module => ( 
                    <ModuleComponent 
                        key={module.id} 
                        module={module} 
                        onDaySelect={handleDaySelect}  
                        onMaterialSelect={handleMaterialSelect} 
                        onAssignmentSelect={handleAssignmentSelect}
                    />
                ))}  
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
                    <div> 
                        <h1> select something </h1>
                    </div>
                    
                );  
                case 'material': 
                    // TODO: Check if materialContent is a PDF or text
                    return renderPDFContent(materialContent);
     
            case 'assignment': 
                    console.log(assignmentContent);
                    return renderPDFContent(assignmentContent);

            case 'chat':  

                return(  
                    <div> 
                        <ChatFeature />
                    </div>
                    
                );   

            case 'chat-settings': 

                return( 
                    <div>  
                        <h1> Teacher Chat Settings Coming Soon </h1>
                    </div>
                );

            default: 
                return( 
                    <div> 
                        Nothing is selected
                    </div>
                )
        }
    };


    return(  
        <>   
        
        <TitleCard title={unitName} /> 

        <div className="modulepage-layout-grid">  

            <div> 
                {renderModules()} 
            </div>  
            
            <div> 
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