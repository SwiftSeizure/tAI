import React from "react";  
import { useNavigate } from "react-router-dom"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';    
import '../App.css';
import headers from "../CSS/Headers.css"
import TitleHeading from "./animations/TitleHeading";

const TitleCard = ( { title  } ) => {   


    const navigate = useNavigate(); 


    const goBackPage = (e) => {  
        e.preventDefault();
        
        navigate(-1);

    };

    
    return( 
        <>   
        <div className="relative flex items-center justify-center h-fit bg-blue-400 px-4 w-full "> 

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