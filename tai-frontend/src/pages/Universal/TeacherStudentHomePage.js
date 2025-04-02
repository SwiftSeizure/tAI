import React from "react";  
import { useNavigate } from 'react-router-dom';  
import useUser from "../../hooks/useUser";
import ClassCard from "../../components/ClassCard";

const TeacherStudentHomePage = (  ) => {   

    const {user, isLoading } = useUser(); 


    function getUser() {
        const userData = localStorage.getItem('user');
        try {
            const userObj = JSON.parse(userData);
            return userObj.role === 'teacher1';
        } catch (error) {
            console.error("Error parsing user data:", error);
            return false;
        }
      }

    function populateClassCards() {   

        
        // BACKEND !!!!!!!!!!
        // Need to get a teachers ID here and see what classes they are enrolled in through the DB  
        // Get all classes that a student/teacher is enrolled in 
        // BACKEND !!!!!!!!!!! 


        //TODO: Help with routes for this through the DB

        // Loop through all the classes and pass it down to the Class Card  
        if ("teahcer1" === localStorage.getItem('user').teacherOrStudent) {
            return( 
                <div>  
                    <ClassCard />
                </div>
            )
        } 
        else { 
            return;
        }

    } 

    // Make some kind of loop here to populate the class Cards with the DB  

    return( 
        <>
        <div>  
            <h1> Welcome {localStorage.getItem('user').teacherOrStudent}</h1>
            <h1> 
                This is going to be the Basic Home Page For Both Teachers and Students 
            </h1>   
            {populateClassCards()}
            {getUser() && <ClassCard />} 

            <h2>  
                
                We can Create classes as components and then allow for extra functionality if they are a teacher or a student 
            </h2>
        </div> 
        </>
    );
}  


export default TeacherStudentHomePage;