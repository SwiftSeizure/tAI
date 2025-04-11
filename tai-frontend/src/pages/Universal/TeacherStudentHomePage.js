import React, {useState, useEffect} from "react";  
import { useNavigate, useLocation } from 'react-router-dom';  
import useUser from "../../hooks/useUser";
import ClassCard from "../../components/ClassCard"; 
import axios from "axios";

const TeacherStudentHomePage = (  ) => {   


    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);  

    const [data, setData] = useState([]);
    
    const location = useLocation(); 
    const { userID, name, role } = location.state || {};  

    const stateData = { 
        userID, 
        name, 
        role, 
    }; 


    useEffect(() => {  

        const loadClassCards = async() => { 
            const response = null;  
            const headers = {  
                // Add auth here for the token once we have it 
                'Content-Type': 'application/json'
            }
            if (role === 'teacher') {  

                console.log("Teacher Fail");
                // BACKEND ROUTE
                response = await axios.get( 
                    `/home/teacher/${userID}`, 
                    { headers }
                    
                );   
                

                
            } 
            else {  

                // BACKEND ROUTE
                response = await axios.get( 
                    `/home/student/${userID}`, 
                    { headers }, 
                    
                );  
            }    
           
            setData(response);
            populateClassCards(response);
        } 

        // Add auth here for isloading in useUser then make the loadClassCards Call 
        loadClassCards(); 

        // These need to be here because any time a class is changed, or the user changes, or the response data changes the class cards will need to be repopulated
    }, [userID, role, data]); 



    const populateClassCards = (response) => {   
        // e.preventDefault();  

        // CHANGE THIS IN FUTURE FOR USER AUTH 
        // const userInFunction = localStorage.getItem('user').teacherOrStudent; 
        // console.log("This is in the populate class cards function", userInFunction);
        // END CHANGE  


        // TODO make JSON parser here   
        console.log("This is all the data we have received", response);  
        


        

        // TODO 
        // Set the Cards here with the data from the response, map through adding each one as a div so styling is consistent, 
        // must be in a fragments since multiple divs  (similar format bellow)
        // {users.map(user => (
        //     <div key={user.id}>
        //       <UserCard name={user.name} />
        //       <UserStats stats={user.stats} />
        //     </div>
        //   ))}  



        return( 
            <>  
            <div>  
                <ClassCard  
                // classroom={classroom}  
                classroom={""}
                userID={userID}
                role={role}
                />
            </div>
            </>
        )

         

    }; 





    // Make some kind of loop here to populate the class Cards with the DB  
    // TODO Add Welcome user 
    return( 
        <>
        <div  id=".myDiv">    

            
            
            <h1> Welcome { name }</h1>
            <h1> 
                This is going to be the Basic Home Page For Both Teachers and Students 
            </h1>  


            <h2>  
                
                We can Create classes as components and then allow for extra functionality if they are a teacher or a student 
            </h2>
        </div> 
        </>
    );
}  


export default TeacherStudentHomePage;