import React, {useState, useEffect } from "react";   
import { useLocation } from 'react-router-dom';   
import { getRequest } from "../../API";
import axios from "axios";
import UnitCard from "../../components/UnitCard";
import ClassCard from "../../components/ClassCard";
import TitleCard from "../../components/TitleCard";

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

    // State to store the list of units fetched from the backend
    const [data, setData] = useState([]); 

    // State to track the loading status
    const [isLoading, setLoading] = useState(true);

    // Retrieve class and user information from the location state
    const location = useLocation(); 
    const { classID, userID, role, classname } = location.state || {};


    /**
     * useEffect Hook
     * Fetches unit data from the backend when the component mounts or when `classID`, `userID`, or `role` changes.
     */
    useEffect(() => {    

        // Function to load unit cards from the backend
        const loadUnitCards = async () => { 
        
            
            setLoading(true);
            try {  
                // Get the unit data from the backend based on classID
                const url = `/classroom/${classID}/units`;
                const response = await getRequest(url);  
                setData(response.data.units); 

                // Populate the unit cards with the fetched data
                populateUnitCards();  
            } 
            catch (error) { 
                console.log(error);
            }    
            finally { 
                setLoading(false); 
                
            }

        };

        // Call the function to load unit cards
        loadUnitCards();

    }, [classID, userID, role]);


    /**
     * populateUnitCards
     * Generates a list of `UnitCard` components based on the fetched unit data.
     * Each `UnitCard` represents a unit associated with the class.
     */
    const populateUnitCards = () => {  

        return(  
            <>  
            {Array.isArray(data) && data.map(unit => (  
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

            {/* Grid layout for unit cards */}
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
        </div>
            
        </>

    );

} 

export default TeacherStudentUnitPage;