import React, { useEffect } from "react";   
import UnitCard from "../components/UnitCard";
import { TitleCard } from "../../shared/components/TitleCard"; 
import Loading from "../../shared/components/Loading"; 
import { useCurrentUser } from "../../store/user-store";
import { useCurrentClass } from "../../store/class-store"; 
import { useUnit } from "../../store/unit-store";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../../store/user-store";
import { useAllUnits, useUnitLoading, useUnitError } from "../../store/unit-store";

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
    const { currentClass } = useCurrentClass(); 
    const { user } = useCurrentUser();
    const navigate = useNavigate();
    const [state, { setCurrentUnit, fetchUnits } ] = useUnit();  
    const isAuthenticated = useIsAuthenticated(); 
    const { units } = useAllUnits();
    const { isLoading } = useUnitLoading();
    const { error } = useUnitError();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]); 

    useEffect(() => {
        fetchUnits(currentClass.id);
    }, [currentClass.id]);


    const handleUnitSelect = async (unitID) => {
        try { 
            console.log("hANDLE UNIT SELECT CALLED", unitID);  
            if (!unitID && user.role === "teacher") {
                navigate('/createunit');
                return;
            }
            await setCurrentUnit(unitID);
            navigate('/modulepage');
        } 
        catch (error) {
            console.error('Error selecting unit:', error);
        }
    };

    /**
     * populateUnitCards
     * Generates a list of `UnitCard` components based on the fetched unit data.
     * Each `UnitCard` represents a unit associated with the class.
     */
    const populateUnitCards = () => {   
        if (isLoading) return <div>Loading units...</div>;
        if (error) return <div>Error loading units: {error}</div>;

        return(  
            <>  
            {Array.isArray(units) && units.map(unit => (  
                <UnitCard 
                    key={unit.id} 
                    unitID={unit.id} 
                    unitName={unit.name}  
                    onClick={handleUnitSelect}
                />
            ))}  

            </>
        )

    };


    // TODO: add check for if teacher, teacher give the oportunity to add a class. 

    return(  
        <> 
        <div className="min-h-screen min-w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient"> 
            <TitleCard 
                title={currentClass?.name} 
                classID={currentClass?.id}
                intro={true}
            />   

            {isLoading 
                ? <Loading /> 
                :  
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-4">     
                        {populateUnitCards()}    
                        {user.role === "teacher" 
                            ? <UnitCard 
                                key={null} 
                                unitID={null}
                                unitName={null}  
                                onClick={handleUnitSelect}/>
                            : null
                        }  
                    </div>
            }
        </div>
            
        </>

    );

} 

export default TeacherStudentUnitPage;