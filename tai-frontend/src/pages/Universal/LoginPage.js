import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';   
import TeacherStudentHomePage from "./TeacherStudentHomePage";

const LoginPage = () => { 
    const [teacherOrStudent, setTeacherOrStudent] = useState(''); 
    const navigate = useNavigate(); 


    // Need to chance with USER AUTH 
    const logIn = async () => { 
        try { 
            const user = { teacherOrStudent };
            localStorage.setItem('user', JSON.stringify(user));   
             
            // TODO: Change once we have authentication  
            if (teacherOrStudent === 'teacher') { 
                navigate("/HomePage");
            }  
            else { 
                navigate("/HomePage");
            }
            
        } 
        catch (e) { 
            console.log("There was an error wile logging in");
        }
    } 
    // END CHANGE 



    return ( 
        <> 
         <div>
            <label>
                <input
                    type="radio"
                    name="role"
                    value="teacher"
                    onChange={() => setTeacherOrStudent('teacher')}
                />
                Teacher
            </label>
            <label>
                <input
                    type="radio"
                    name="role"
                    value="student"
                    onChange={() => setTeacherOrStudent('student')}
                />
                Student
            </label>
        </div> 

        <button onClick={logIn}>Log In</button> 
        </>
    );
}  

export default LoginPage;