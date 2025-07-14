import { useNavigate } from 'react-router-dom';   

/**
 * ClassCard Component
 * This component represents a card for a class. It displays the class name
 * and allows navigation to different pages based on the user's role and actions.
 * Props:
 * - classID: Unique identifier for the class
 * - classname: Name of the class
 * - userID: ID of the current user
 * - role: Role of the user (e.g., "teacher" or "student")
 */
const ClassCard = ( {classID, classname, userID, role}  ) => {   


    // Logo for the class card 
    // TODO: change this to allow teacher to upload or select from a list of logos
    const logo = require("../images/example-class-logo.png");  

    // Hook to navigate to the UnitPage
    const navigate = useNavigate();   



    /**
     * goToUnitPage
     * Navigates to the unit page for the selected class.
     * Passes classID, userID, role, and classname as state to the next page.
     */
    const goToUnitPage = (e) => { 
        e.preventDefault();  
        navigate('/unitpage', {state: {classID, userID, role, classname}})
    }; 



    /**
     * goToNewClassPage
     * Navigates to the appropriate page for adding or creating a class.
     * - Teachers are redirected to the "create class" page.
     * - Students are redirected to the "join class" page.
     */
    const goToNewClassPage = (e) => { 
        e.preventDefault();  

        if (role === "teacher") { 
            // Go to CreateClass page for teacher  
            navigate('/createclass', {state: { userID, role}});
        } 
        else { 
            // Go to the JoinClass page for student 
            navigate('/joinclass', {state: { userID, role}});
        }

    };

 
    // Render the class card based on the classname prop
    if (classname !== "newClass") { 
        return(  
            <div className="overflow-hidden p-12">  
                <button 
                    className="bg-blue-400 bg-opacity-30 p-4 cursor-pointer flex flex-col items-center rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-pink-400 hover:border-pink-500" 
                    onClick={ (e) => goToUnitPage(e) }
                    >   
                    {/* Display the class logo */} 
                    <div className="pb-2 rounded-md"> 
                        <img  
                        className="w-52 h-52 rounded-md "  
                        src={logo} 
                        alt="Class Logo" />
                    </div>

    
                    {/* Display the class name */}
                    <div className="border-2 border-white/30 rounded-md backdrop-blur-sm bg-white/10 flex-wrap" >  
                       <h3 className="p-2 rounded-md" > 
                            {classname} 
                        </h3> 
                    </div> 
                    
                </button>
            </div>
            
        );
    }  
    // Create card for either adding or joining a class based on the role
    else { 
        return ( 
            <div className="overflow-hidden p-12"> 
                <button 
                 className="bg-blue-400 bg-opacity-30 p-4 cursor-pointer flex flex-col items-center rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-green-400 hover:border-green-500" 
                    onClick={ (e) => goToNewClassPage(e) } 
                    > 
                    <div className="pb-2 rounded-md">  
                        {/* Display the class logo  TODO change this to a plus or something similar */}
                        <img 
                        className="w-52 h-52 rounded-md"  
                        src={logo} 
                        alt="Class Logo" /> 
                    </div> 
                    {/* Display a placeholder for the new class logo */}
                    <div className="border-2 border-white/30 rounded-md backdrop-blur-sm bg-white/10 flex-wrap">  
                        <h3 className="p-2 rounded-md"> 
                            Add New class
                        </h3>
                     
                    </div>
                </button> 

            </div>
        )
    }
} 

export default ClassCard;