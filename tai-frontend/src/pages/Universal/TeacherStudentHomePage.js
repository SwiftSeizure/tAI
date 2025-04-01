import React from "react";  
import { useNavigate } from 'react-router-dom';  
import ClassCard from "../../components/ClassCard";

const TeacherStudentHomePage = () => {  

    function getUser() {
        const userData = localStorage.getItem('user');
        try {
          const userObj = JSON.parse(userData);
          return userObj.teacherOrStudent === 'teacher';
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
        return( 
            <div>  
                <ClassCard />
            </div>
        )
    } 

    // Make some kind of loop here to populate the class Cards with the DB  

    return( 
        <>
        <div> 
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