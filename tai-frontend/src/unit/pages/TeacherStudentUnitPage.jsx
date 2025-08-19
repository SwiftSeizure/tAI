import React from "react";   
import { useUnits } from "../hooks/useUnits";
import UnitCard from "../components/UnitCard";
import { TitleCard } from "../../shared/components/TitleCard"; 
import Loading from "../../shared/components/Loading"; 
import { useCurrentUser } from "../../store/user-store";
import { useCurrentClass } from "../../store/class-store";


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
    console.log(currentClass);
    const { user } = useCurrentUser();

    // Hook to fetch unit data from the backend 
    console.log("This is the current class in the unit page",currentClass);
    const { units, isLoading } = useUnits(currentClass.id);

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
                    classID={currentClass.id}
                    userID={user.id} 
                    role={user.role}
                />
            ))}  

            {user.role === "teahcer" 
                ? <UnitCard 
                    key={null} 
                    unitID={null}
                    unitName={null}  
                    classID={currentClass.classID}
                    userID={user.id}
                    role={user.role}/> 
                : null
            }
            </>
        )

    };


    // TODO: add check for if teacher, teacher give the oportunity to add a class. 

    return(  
        <> 
        <div className="min-h-screen min-w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient"> 
            <TitleCard 
                title={currentClass?.name} 
                settings={true}  
                classID={currentClass?.id}
                intro={true}
            />   

            {isLoading 
                ? <Loading /> 
                :  
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-4">     
                        {populateUnitCards()}     
                        <UnitCard 
                            key={"newUnit"} 
                            unitID={null}
                            unitName={null} 
                            userID={user.id}
                            role={user.role}
                        />
                    </div>
            }
        </div>
            
        </>

    );

} 

export default TeacherStudentUnitPage;