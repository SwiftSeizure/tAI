import React, { useState} from "react"; 
import TitleCard from "../../shared/components/TitleCard"; 
import { useLocation, useNavigate } from "react-router-dom"; 
import axios from "axios";

// Not yet implemented, but this is the page for creating a unit.
// It will be similar to the CreateClassPage, but for units instead of classes, and take the teacher to the module page 
const CreateUnitPage = () => {    

    const [newUnitName, setNewUnitName] = useState("");

    const location = useLocation();  
    const {classID, userID, role } = location.state || {};  

    const navigate = useNavigate();


    const handleCreateUnit = async (e) => { 
        e.preventDefault();  

        // TODO: Send post, 
        // Add route to unit page    
        try { 
            const requestBody = {
                name: newUnitName, 
                settings: { 

                } 
            } 

            axios.post(`http://localhost:8000/classroom/${classID}/unit`, 
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                } 
            ).then((response) => { 

                const unitID = response.data.id; 
                const unitname = response.data.name;  
                
                navigate('/modulepage', {state: { unitID, unitname, userID, role}});

            }).catch((error) => { 
                console.log("Error creating unit:", error);
            });
        } 
        catch (error) { 
            console.log("Error creating unit:", error);
        }

    }; 

     

return( 
    <>
    <TitleCard title={"Create A Unit"} intro={true}/>   

    <form onSubmit={handleCreateUnit} className="flex flex-col items-center">   

        <input
            className="w-1/2 p-2 rounded border border-gray-300 text-base mb-2.5"
            onChange={(e) => setNewUnitName(e.target.value) }  
            type="text"
            placeholder="Enter New Unit Name"
            > 

        
        </input> 

        <button
            className="inline-block w-[200px] cursor-pointer border-2 border-gray-300 rounded-lg p-4 m-2 bg-transparent
                font-medium text-[1.1rem] text-gray-800 text-center font-nunito
                transition-all duration-300 ease-in-out hover:bg-gray-100"
            type="submit"
        > 
            Create Unit
        </button>


    </form>


    </>
);

}; 

export default CreateUnitPage;