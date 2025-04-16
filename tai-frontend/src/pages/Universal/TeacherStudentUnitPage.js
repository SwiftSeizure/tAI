import React, {useState, useEffect } from "react";   
import { useLocation } from 'react-router-dom';   
import { getRequest } from "../../API";
import axios from "axios";
import UnitCard from "../../components/UnitCard";
import ClassCard from "../../components/ClassCard";
import TitleCard from "../../components/TitleCard";



const TeacherStudentUnitPage = () => {    


    const [data, setData] = useState([]); 
    const [isloading, setLoading] = useState(true);

    const location = useLocation(); 
    const {classID, userID, role, classname} = location.state || {};


    useEffect(() => {    

        const loadUnitCards = async () => { 
        
            setLoading(true);
            try {  

                const url = `/classroom/${classID}/units`;
                const response = await getRequest(url);  
                // May have to mess around with this response
                setData(response.data.units); 

                populateUnitCards();  
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
 

        console.log(data); 

        return(  
            <>  
            <div className="card-layout-container"> 

                
                {Array.isArray(data) && data.map(unit => (  
                    <UnitCard 
                        key={unit.id} 
                        unitID={unit.id} 
                        unitName={unit.name} 
                        userID={userID} 
                        role={role}
                    />
                ))} 
            </div>
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

        <div>  
            {populateUnitCards()}   
        </div>
            
        </>

    );

} 

export default TeacherStudentUnitPage;