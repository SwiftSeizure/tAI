import React, {useState, useEffect } from "react";   
import { useLocation } from 'react-router-dom';   
import { getRequest } from "../../API"; 
import axios from "axios";
import UnitCard from "../../components/UnitCard";
import ClassCard from "../../components/ClassCard";
import TitleCard from "../../cards/TitleCard";



const TeacherStudentUnitPage = () => {    


    const [data, setData] = useState([]); 
    const [isloading, setLoading] = useState(true);

    const location = useLocation(); 
    const {classID, userID, role, classname} = location.state || {};


    useEffect(() => {    

        const loadUnitCards = async () => { 
        
            setLoading(true);
            try {  

                const url = `unitpage/${role}/${classID}`;
                const response = await getRequest(url);  
                // May have to mess around with this response
                setData(response); 
                populateUnitCards();  
                console.log("This is the response from the unit page: ", response)

            } 
            catch (error) { 
                console.log(error);
            }    
            finally { 
                setLoading(false);
            }

        };

        loadUnitCards();

    }, [classID, userID, role]);

    const populateUnitCards = () => {  



        return(  
            <> 
            {Array.isArray(data) && data.map(unit => ( 
                <ClassCard 
                    key={classID} 
                    unitID={unit.id} 
                    unitName={unit.name} 
                    userID={userID} 
                    role={role}
                />
            ))}
            </>
        )

    };



    
    return(  
        <> 
        <div className="title-card-center">  
            <TitleCard 
                title={classname}
            />
        </div> 
            {populateUnitCards()}   
        </>

    );

} 

export default TeacherStudentUnitPage;