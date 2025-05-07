import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';   
import buttons from "../../CSS/Buttons.css";
import grids from "../../CSS/Grids.css"; 
import TitleCard from '../../components/TitleCard'; 
import '../../App.css'

const teacherImage = require('../../images/teacher-login-image.png')
const studentImage = require('../../images/student-login-image.png');


/**
 * LoginPage Component
 * This page allows users to log in by selecting their role (teacher or student).
 * It includes radio buttons for role selection and a login button to navigate to the home page.
 */

const LoginPage = () => {  

    // State to manage the selected role (teacher or student)
    const [teacherOrStudent, setTeacherOrStudent] = useState('');  

    // Hook to navigate to HomePage
    const navigate = useNavigate(); 


    //TODO: Need to chance with USER AUTH  
    /* logIn
     * Handles the login process by checking the selected role and navigating to the home page,
     * passing the user ID, name, and role as state.
     */
    const logIn = async () => { 
        try {   

            
            // TODO: Change once we have authentication and pass down the uid, the name and the role   

            // Navigate to the home page with the selected role and user information
            // This is just a placeholder for the demo.
            if (teacherOrStudent === 'teacher1') { 
                navigate('/home', {state: { userID: 1, name: 'Mr. Professor', role: 'teacher' }});
            }   
            else if (teacherOrStudent === 'teacher2'){ 
                navigate(`/home`, {state: { userID: 2, name: 'Mrs. Professor', role: 'teacher' }});
            } 
            else if (teacherOrStudent === 'student1'){ 
                navigate(`/home`, {state: { userID: 1, name: 'Student Struggling', role: 'student'}});
            }
            
        }  

        // Handle any errors that occur during the login process
        catch (e) { 
            console.log("There was an error wile logging in");
        }
    } 


    // END CHANGE 


    return ( 
        <>   
        <div className="h-screen w-screen bg-gradient-to-b from-blue-700 via-blue-300 via-green-400 to-blue-700 bg-[length:100%_200%] animate-scrollGradient"> 
            <TitleCard title={""} /> 


            {/* Role selection section */}
            <div className="spacing-login-radio-buttons"> 
                {/* Radio buttons for selecting teacher or student role */}
                <label className="radio-card-button"> 
                    {/* Radio button for teacher role */}
                    <input
                        className="radio-card-button-input"
                        type="radio"
                        name="role"
                        value="teacher1"
                        onChange={() => setTeacherOrStudent('teacher1')}
                    />
                    <div className="radio-card-button-content">
                        <img
                            className="radio-card-button-image"
                            src={teacherImage}
                            alt="Teacher"
                        />
                        <span className="radio-card-button-h1"> Teacher 1 </span>
                    </div> 
                </label>
                <label className="radio-card-button"> 
                    {/* Radio button for student role */}
                    <input 
                        className="radio-card-button-input"
                        type="radio"
                        name="role"
                        value="student1"
                        onChange={() => setTeacherOrStudent('student1')}
                    />  
                    <div className="radio-card-button-content"> 
                        <img 
                            className="radio-card-button-image" 
                            src={studentImage} 
                            alt="Student"
                        /> 
                        <span className="radio-card-button-h1"> Student 1 </span>
                    </div>
                </label> 

                </div>  



            {/* Radio button for demo teacher role */}
            <div>
                <label>
                    <input
                        type="radio"
                        name="role"
                        value="teacher2"
                        onChange={() => setTeacherOrStudent('teacher2')}
                    />
                    Demo teacher
                </label>
            </div> 



            <div className="flex justify-center items-center "> 
                <button 
                    className="rounded border-radius padding bg-yellow-400 bg-transparent"
                    onClick={logIn}
                    >
                       <h3 className="custom-button-login-h2"> Log In </h3> 
                    </button> 
            </div>
        </div>
        
        </>
    );
}  

export default LoginPage; 