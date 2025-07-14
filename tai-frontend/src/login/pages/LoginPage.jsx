import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';   
import TitleCard from '../../shared/components/TitleCard';  
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
        <div className="h-screen w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient"> 
            <TitleCard title={""} /> 


            {/* Role selection section */}
            <div className="pt-[5%] pb-[5%] flex justify-around w-full"> 



                {/* Radio buttons for selecting teacher or student role */}
                <label className="radio-card group block relative w-[200px] cursor-pointer border-2 border-[#e0e0e0] rounded-lg p-4 m-2 transition-all duration-300 ease-in-out 
                    hover:border-[#a0a0a0] hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(0,0,0,0.1)] 
                    focus-within:outline-[6px] focus-within:outline-lightblue focus-within:outline-offset-2"> 
                    {/* Radio button for teacher role */}
                    <input
                        className="absolute opacity-0 cursor-pointer"
                        type="radio"
                        name="role"
                        value="teacher1"
                        onChange={() => setTeacherOrStudent('teacher1')}
                    />
                    <div className="flex flex-col items-center justify-center">
                        <img
                            className="w-full h-auto object-cover rounded mb-3"
                            src={teacherImage}
                            alt="Teacher"
                        />
                        <span className="text-xl font-extrabold text-gray-800 font-nunito"> Teacher 1 </span>
                    </div> 
                </label>
                <label className="radio-card group block relative w-[200px] cursor-pointer border-2 border-[#e0e0e0] rounded-lg p-4 m-2 transition-all duration-300 ease-in-out 
                    hover:border-[#a0a0a0] hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(0,0,0,0.1)] 
                    focus-within:outline-[6px] focus-within:outline-lightblue focus-within:outline-offset-2"> 
                    {/* Radio button for student role */}
                    <input 
                        className="absolute opacity-0 cursor-pointer"
                        type="radio"
                        name="role"
                        value="student1"
                        onChange={() => setTeacherOrStudent('student1')}
                    />  
                    <div className="flex flex-col items-center justify-center"> 
                        <img 
                            className="w-full h-auto object-cover rounded mb-3" 
                            src={studentImage} 
                            alt="Student"
                        /> 
                        <span className="text-xl font-extrabold text-gray-800 font-nunito"> Student 1 </span>
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
                    className="inline-block w-[200px] cursor-pointer border-2 border-gray-300 rounded-lg p-4 m-2 bg-transparent
                    font-medium text-[1.1rem] text-gray-800 text-center font-nunito
                    transition-all duration-300 ease-in-out
                    hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg
                    active:-translate-y-0.5 active:shadow-md
                    focus:outline-none focus:outline-offset-2"
                    onClick={logIn}
                    >
                    Log In
                </button> 
            </div>
        </div>
        
        </>
    );
}  

export default LoginPage; 