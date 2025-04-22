import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';   
import buttons from "../../CSS/Buttons.css";
import grids from "../../CSS/Grids.css";
import TitleCard from '../../components/TitleCard';

const teacherImage = require('../../images/teacher-login-image.png')
const studentImage = require('../../images/student-login-image.png');


const LoginPage = () => { 
    const [teacherOrStudent, setTeacherOrStudent] = useState('');  

    const navigate = useNavigate(); 


    // Need to chance with USER AUTH 
    const logIn = async () => { 
        try {   

            
            const user = { role: teacherOrStudent };
            localStorage.setItem('user', JSON.stringify(user));     

            console.log(user.role);

            
            // TODO: Change once we have authentication and pass down the uid, the name and the role  
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

        catch (e) { 
            console.log("There was an error wile logging in");
        }
    } 


    // END CHANGE 


    return ( 
        <>   

        <TitleCard title={""} /> 

        

        <div className="spacing-login-radio-buttons">
            <label className="radio-card-button">
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



        <div className="center-button-div"> 
            <button 
                className="custom-button-login"
                onClick={logIn}
                >
                   <h3 className="custom-button-login-h2"> Log In </h3> 
                </button> 
        </div>

        
        </>
    );
}  

export default LoginPage; 

// Every single teacher has a unique id 
// This 