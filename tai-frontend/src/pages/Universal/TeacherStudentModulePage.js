import React, { useEffect, useState } from "react";  
import { useLocation } from "react-router-dom";
import TitleCard from "../../components/TitleCard"; 
import axios from "axios";

const TeacherStudentModulePage = () => {     

    const [loading, setLoading] = useState(true); 
    const [data, setData] = useState(null); 

    const location = useLocation(); 

    const {unitID, unitName, userID, role} = location.state || {};


    //TODO: make a get request to get all the modules of the unit  

    useEffect(() => { 

        const loadModules = async () => {  

            try {  


            } 
            catch(error) {
              console.log(error)

            } 
            finally { 
                setLoading(false);
            }

        } 


    });

    //TODO: make a new component for each module with the dropdown so that they can be opened and added 

    // TODO: map all of the components as a list item 



    return(  
        <>   
        <TitleCard 
            title={unitName}
            />
        <div> 
            This is the module page 
        </div>
        </>
    )

}; 

export default TeacherStudentModulePage;