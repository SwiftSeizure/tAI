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

    // Hook to navigate, used for the previous page 
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
        <div className="title-card-center"> 
            {/*if no title is provided, show a default welcome message*/}
            {title === "" ?  (
                <div className="title-only">  
                    <h1 className="title-card-h1"> Welcome to TAi! </h1>  
                </div>
                ) : (  
                <>  
                    <div className="back-button-container">   
                        <button 
                            className="custom-button-title"
                            onClick={ (e) => goBackPage(e)}
                            > 
                            <ArrowBackIcon />
                        </button>  
                    </div> 
                    <div className="title-container">
                        <h1 className="title-card-h1"> {title} </h1> 
                    </div>  
                </>
                )
            }  
        </div>

        </>  
    );
    
}; 

export default TitleCard;