import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';   
import TeacherStudentHomePage from "./TeacherStudentHomePage";

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
                navigate('/home', {state: { userId: 'teacher1', name: 'Batman', role: 'teacher' }});
            }   

            else if (teacherOrStudent === 'teacher2'){ 
                navigate(`/home`, {state: { userId: 'teacher2', name: 'Big Prof', role: 'teacher' }});
            } 
            else if (teacherOrStudent === 'student1'){ 
                navigate(`/home`, {state: { userID: 'student1', name: 'Gangus Khan', role: 'student'}});
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
                    value="teacher1"
                    onChange={() => setTeacherOrStudent('teacher1')}
                />
                Teacher1 
                <input
                    type="radio"
                    name="role"
                    value="teacher2"
                    onChange={() => setTeacherOrStudent('teacher2')}
                />
                Teacher2
            </label>
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