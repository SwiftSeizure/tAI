import React from "react";   
import { useLocation } from 'react-router-dom';   
import { useUnits } from "../hooks/useUnits";
import UnitCard from "../components/UnitCard";
import TitleCard from "../../shared/components/TitleCard"; 
import Loading from "../../shared/components/Loading";

/**
 * TeacherStudentUnitPage 
 * This page displays the units associated with a specific class for both teachers and students.
 * It fetches unit data from the backend and renders a grid of `UnitCard` components.
 * 
 * Features:
 * - Fetches unit data based on the class ID.
 * - Displays a title card with the class name.
 * - Renders a grid of `UnitCard` components for each unit.
 */

const TeacherStudentUnitPage = () => {    

    // Retrieve class and user information from the location state
    const location = useLocation(); 
    const { classID, userID, role, classname } = location.state || {}; 

    // Hook to fetch unit data from the backend
    const { units, isLoading, error } = useUnits(classID);

    /**
     * populateUnitCards
     * Generates a list of `UnitCard` components based on the fetched unit data.
     * Each `UnitCard` represents a unit associated with the class.
     */
    const populateUnitCards = () => {  

        return(  
            <>  
            {Array.isArray(units) && units.map(unit => (  
                <UnitCard 
                    key={unit.id} 
                    unitID={unit.id} 
                    unitName={unit.name}  
                    classID={classID}
                    userID={userID} 
                    role={role}
                />
            ))}  

            {role === "teahcer" 
                ? <UnitCard 
                    key={null} 
                    unitID={null}
                    unitName={null}  
                    classID={classID}
                    userID={userID}
                    role={role}/> 
                : null
            }
            </>
        )

    };


    // TODO: add check for if teacher, teacher give the oportunity to add a class. 

    return(  
        <> 
        <div className="min-h-screen min-w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient"> 
            <TitleCard title={classname} />   

            {isLoading 
                ? <Loading /> 
                :  
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-4">     
                        {populateUnitCards()}     
                        <UnitCard 
                            key={"newUnit"} 
                            unitID={null}
                            unitName={null} 
                            userID={userID}
                            role={role}
                        />
                    </div>
            }
        </div>
            
        </>

    );

} 

export default TeacherStudentUnitPage;