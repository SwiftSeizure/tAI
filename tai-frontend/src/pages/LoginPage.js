import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';  

const LoginPage = () => { 
    const [teacherOrStudent, setTeacherOrStudent] = useState(''); 
    const navigate = useNavigate(); 

    const logIn = async () => { 
        try { 
            const user = { teacherOrStudent };
            localStorage.setItem('user', JSON.stringify(user));  // Store the user in localStorage
            navigate('/home');
        } 
        catch (e) { 
            console.log("There was an error wile logging in");
        }
    }


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