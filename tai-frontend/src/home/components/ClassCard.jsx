import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete'; 
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
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
const ClassCard = ( { 
    classroom, 
    onClick, 
    onClickSettings,
    admin,
    onClickDelete, 
    onClickRoster,
    onPublishClass
}  ) => {
    
    const handleClick = () => { 
        onClick(classroom);
    };

    const handleClickSettings = () => { 
        onClickSettings(classroom);
    }; 

    const handleClickDelete = () => { 
        onClickDelete(classroom);
    }; 

    const handleClickRoster = () => { 
        onClickRoster(classroom);
    };  

    const handleClickPublish = () => { 
        onPublishClass(classroom);
    }; 

    // Logo for the class card 
    // TODO: change this to allow teacher to upload or select from a list of logos
    const logo = require("../../images/example-class-logo.png");  

 
    //TODO: make one conditional on if this is a new class or not 
    // Render the class card based on the classname prop
    if (classroom?.name !== "newClass") { 
        return(  
            <div className="overflow-hidden p-12">   
                {onClickSettings && admin && (
                    <button 
                        onClick={ () => handleClickSettings() }
                        className="bg-blue-400 bg-opacity-30 p-4 cursor-pointer flex flex-col items-center rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-pink-400 hover:border-pink-500" 
                    >
                        <SettingsIcon />   
                    </button>
                )} 

                {onClickDelete && classroom.id && admin && (
                    <button 
                        onClick={ () => handleClickDelete() }
                        className="bg-blue-400 bg-opacity-30 p-4 cursor-pointer flex flex-col items-center rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-pink-400 hover:border-pink-500" 
                    >
                        <DeleteIcon />   
                    </button>
                )}  
                {onClickRoster && classroom.id && admin && (
                    <button 
                        onClick={ () => handleClickRoster() }
                        className="bg-blue-400 bg-opacity-30 p-4 cursor-pointer flex flex-col items-center rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-pink-400 hover:border-pink-500" 
                    >
                        <PersonIcon />   
                    </button>
                )} 

                {onPublishClass && classroom.id && admin && (
                    <button 
                        onClick={ () => handleClickPublish() }
                        className="bg-blue-400 bg-opacity-30 p-4 cursor-pointer flex flex-col items-center rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-pink-400 hover:border-pink-500" 
                    > 
                       {classroom.published ? (
                        <VisibilityIcon />
                       ) : (
                        <VisibilityOffIcon />
                       )}  
                    </button>
                )} 


                <button 
                    className="bg-blue-400 bg-opacity-30 p-4 cursor-pointer flex flex-col items-center rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-pink-400 hover:border-pink-500" 
                    onClick={ () => handleClick() }
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
                            {classroom?.name} 
                        </h3>  
                        {admin && ( 
                            <div className="flex flex-col items-center" > 
                                <h3 className="p-2 rounded-md" > 
                                    {classroom?.published ? "Published" : "Not Published"} 
                                </h3>  
                                <h3 className="p-2 rounded-md" > 
                                    {classroom.classCode} 
                                </h3>  
                            </div> 
                        )} 

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
                    onClick={ () => handleClick() } 
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