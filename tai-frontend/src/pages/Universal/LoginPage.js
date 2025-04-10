import styles from '../Pages.css';
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';   
import TeacherStudentHomePage from "./TeacherStudentHomePage";  

var teacherImage = require('../../images/teacher-login-image.png');
var studentImage = require('../../images/student-login-image.png');


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
        <div >
            <span className="login-input-spacing"> 
                <label> 
                    <input 
                        className="radio-login-card"
                        type="radio"
                        name="role"
                        value="teacher1"
                        onChange={() => setTeacherOrStudent('teacher1')}
                    /> 
                    <img src={teacherImage} />
                    Teacher1  
                </label> 
                <label>
                    <input 
                        className="radio-login-card"
                        type="radio"
                        name="role"
                        value="teacher2"
                        onChange={() => setTeacherOrStudent('teacher2')}
                    /> 
                    
                    Teacher2 
                </label>
            </span> 
        </div> 
        <div>
            <label>
                <input
                    type="radio"
                    name="role"
                    value="student1"
                    onChange={() => setTeacherOrStudent('student1')}
                />
                Student1
            </label>
        </div> 

        <button onClick={logIn}>Log In</button> 
        </>
    );
}  

export default LoginPage; 

// Every single teacher has a unique id 
// This 