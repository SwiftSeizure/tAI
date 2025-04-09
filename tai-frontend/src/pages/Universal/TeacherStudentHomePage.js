import React, {useState, useEffect} from "react";  
import { useNavigate, useLocation } from 'react-router-dom';  
import useUser from "../../hooks/useUser";
import ClassCard from "../../components/ClassCard"; 
import axios from "axios";

const TeacherStudentHomePage = (  ) => {   


    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    
    const location = useLocation(); 
    const { id, name, role } = location.state || {};  

    const stateData = { 
        id: id, 
        name: name, 
        role: role, 
    };


    const populateClassCards = async() => {   
        // e.preventDefault();  

        // CHANGE THIS IN FUTURE FOR USER AUTH 
        const userInFunction = localStorage.getItem('user').teacherOrStudent; 
        console.log("This is in the populate class cards", userInFunction);
        // END CHANGE 

        try {  
            // Ideally this   
            const response = null; 

            if (role === 'teacher') { 
                response = axios.get( 
                    // BACKEND 
                    // Get requests can not have state, they need to have a url parameter 
                    `/home/teacher/${id}`, 
                    { timeout: 10000 }
                ); 
            } 
            else { 
                response = axios.get( 
                    // BACKEND 
                    // Get requests can not have state, they need to have a url parameter 
                    `/home/student/${id}`, 
                    { timeout: 10000 }
                ); 
            } 

            console.log(response); 
            // TODO 
            // Set the Cards here with the data from the response, map through adding each one as a div so styling is consistent, 
            // must be in a fragments since multiple divs  (similar format bellow)
            // {users.map(user => (
            //     <div key={user.id}>
            //       <UserCard name={user.name} />
            //       <UserStats stats={user.stats} />
            //     </div>
            //   ))}
            return( 
                <>  
                <div> 
                    <ClassCard stateData={ stateData }/>
                </div>
                </>
            )

        } 
        catch (error) { 
            console.log("Bad Bad Bad request for getting th classes from backend", error); 
            setError(error); 
            setLoading(false); 
            return;

        }

    };



    // Make some kind of loop here to populate the class Cards with the DB  
    // TODO Add Welcome user 
    return( 
        <>
        <div>  
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