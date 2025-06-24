import React from "react";  
import { useNavigate } from "react-router-dom"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';    
import '../App.css';
import TitleHeading from "./animations/TitleHeading";

/**
 * TitleCard Component
 * This component displays a title card with an optional back button.
 * If no title is provided, it displays a default welcome message.
 * 
 * Props:
 * - title: The title to display on the card. If empty, a default message is shown.
 */
const TitleCard = ( { title, intro } ) => {   


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
        <div className="relative flex items-center justify-center h-fit px-4 w-90 "> 
            {/*if no title is provided, show a default welcome message*/}
            {title === "" ?  (  
                

                <div className="flex justify-center w-full">  
                    <TitleHeading title={'Welcome to TAi!'} transitionTime={100} intro={true}/>
                </div> 
                
                ) : (  
                <>  
                    <div className="absolute left-2">   
                        <button 
                            className="flex w-10 h-10 cursor-pointer rounded-md p-4 m-2 font-medium text-[1.1rem] text-gray-800 justify-center items-center hover:shadow-2xl active:shadow-sm focus:outline-offset-2 "
                            onClick={ (e) => goBackPage(e)}>   
                            {/* TODO fix this arrow icon to make it seamless  */}
                            <ArrowBackIcon  className="transform scale-100 transition-transform duration-300 ease-in hover:scale-150" />
                        </button>  
                    </div> 
                    <div className="flex-grow flex justify-center">
                        <TitleHeading title={title} intro={intro} transitionTime={10} /> 
                    </div>   
                    <div className="absolute-right-2"> 
                        Settings TODO
                    </div>
                </>
                )
            }  
        </div>

        </>  
    );
    
}; 

export default TitleCard;