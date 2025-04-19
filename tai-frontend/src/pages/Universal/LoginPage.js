import styles from '../Pages.css';
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';   
import TeacherStudentHomePage from "./TeacherStudentHomePage";   
import buttons from "../../CSS/Buttons.css"
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
                navigate('/home', {state: { userID: 1, name: 'Batman', role: 'teacher' }});
            }   

            else if (teacherOrStudent === 'teacher2'){ 
                navigate(`/home`, {state: { userID: 2, name: 'Big Prof', role: 'teacher' }});
            } 
            else if (teacherOrStudent === 'student1'){ 
                navigate(`/home`, {state: { userID: 1, name: 'Gangus Khan', role: 'student'}});
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
        

        <div className="login-input-spacing">
            <label className="radio-card">
                <input
                    className="radio-card-input"
                    type="radio"
                    name="role"
                    value="teacher1"
                    onChange={() => setTeacherOrStudent('teacher1')}
                />
                <div className="radio-card-content">
                    <img
                        className="radio-card-image"
                        src={teacherImage}
                        alt="Teacher"
                    />
                    <span className="radio-card-label"> Teacher 1 </span>
                </div> 
            </label>
            <label className="radio-card">
                <input 
                    className="radio-card-input"
                    type="radio"
                    name="role"
                    value="student1"
                    onChange={() => setTeacherOrStudent('student1')}
                />  
                <div className="radio-card-content"> 
                    <img 
                        className="radio-card-image" 
                        src={studentImage} 
                        alt="Student"
                    /> 
                    <span className="radio-card-label"> Student 1 </span>
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



        <div className="center-login-button"> 
            <button 
                className="custom-button-standard"
                onClick={logIn}
                >
                    Log In
                </button> 
        </div>

        
        </>
    );
}  

export default LoginPage; 

// Every single teacher has a unique id 
// This 