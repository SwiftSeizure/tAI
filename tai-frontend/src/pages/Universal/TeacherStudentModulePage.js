import React from "react";  
import { useLocation } from "react-router-dom";
import TitleCard from "../../components/TitleCard";

const TeacherStudentModulePage = () => {    

    const location = useLocation();

    const {unitID, unitName, userID, role} = location.state || {};


    //TODO: make a get request to get all the modules of the unit 

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