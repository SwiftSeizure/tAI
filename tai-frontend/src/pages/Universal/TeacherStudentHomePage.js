import React, {useState, useEffect} from "react";  
import { useLocation } from 'react-router-dom';  
import useUser from "../../hooks/useUser";
import ClassCard from "../../components/ClassCard"; 
import axios from "axios"; 
import { getRequest } from "../../API";

const TeacherStudentHomePage = (  ) => {   


    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);  

    const [data, setData] = useState([]);
    
    const location = useLocation(); 
    const { userID, name, role } = location.state || {};  

    // const stateData = { 
    //     userID, 
    //     name, 
    //     role, 
    // }; 


    useEffect(() => {  

        const loadClassCards = async() => {  

            try { 
                setLoading(true);
            
                const url = `/home/${role}/${userID}`;
                // BACKEND ROUTE 
                const response = await getRequest(url);  
                setData(response.data.classes);
            
                populateClassCards(); 

            } 
            catch(error) { 
                setError(error);
            }  
            finally { 
                setLoading(false);
            }
        };

        // Add auth here for isloading in useUser then make the loadClassCards Call 
        loadClassCards(); 

        // These need to be here because any time a class is changed, or the user changes, or the response data changes the class cards will need to be repopulated
    }, [userID, role]); 



    const populateClassCards = (classes ) => {   
        // e.preventDefault();  

        return( 
            <>  
            {Array.isArray(data) && data.map(classroom => (
                <ClassCard   
                    key={classroom.id} 
                    classID={classroom.id}
                    classname={classroom.name}  
                    userID={userID}
                    role={role}
                />
            ))}
            
            </>
        )
    }; 





    // Make some kind of loop here to populate the class Cards with the DB  
    // TODO Add Welcome user 
    return( 
        <>
        <div  id=".myDiv">    

            
            
            <h1> Welcome { name }</h1>
            <h1> 
                This is going to be the Basic Home Page For Both Teachers and Students 
            </h1>   

            {populateClassCards()} 

            <h2>  
                We can Create classes as components and then allow for extra functionality if they are a teacher or a student 
            </h2>
        </div> 
        </>
    );
}  


export default TeacherStudentHomePage;