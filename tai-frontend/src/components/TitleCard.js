import React from "react";  
import { useNavigate } from "react-router-dom"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';    
import '../App.css';
import headers from "../CSS/Headers.css"
import TitleHeading from "./animations/TitleHeading";

/**
 * TitleCard Component
 * This component displays a title card with an optional back button.
 * If no title is provided, it displays a default welcome message.
 * 
 * Props:
 * - title: The title to display on the card. If empty, a default message is shown.
 */
const TitleCard = ( { title  } ) => {   


    const navigate = useNavigate(); 

    // TODO: change this to make it so that it keeps a list of pages  
    /**
     * goBackPage
     * Navigates the user to the previous page when the back button is clicked.
     * @param {Event} e - The click event
     */
    const goBackPage = (e) => {  
        e.preventDefault();
        
        navigate(-1);

    };

    
    return( 
        <>   
        <div className="relative flex items-center justify-center h-fit bg-blue-400 px-4 w-full "> 
            {/*if no title is provided, show a default welcome message*/}
            {title === "" ?  (  
                

                <div className="flex justify-center w-full">  
                    <TitleHeading title={'Welcome to TAi!'} transitionTime={100} />
                </div> 
                
                ) : (  
                <>  
                    <div className="absolute left-4">   
                        <button 
                            className="custom-button-title"
                            onClick={ (e) => goBackPage(e)}
                            > 
                            <ArrowBackIcon />
                        </button>  
                    </div> 
                    <div className="flex-grow flex justify-center">
                        <TitleHeading title={title} transitionTime={25} /> 
                    </div>  
                </>
                )
            }  
        </div>

        </>  
    );
    
}; 

export default TitleCard;