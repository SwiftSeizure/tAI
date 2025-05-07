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
        <div className="grid grid-cols-2 items-center h-fit bg-blue-400 padding: 0.25rem "> 

            {title === "" ?  (  
                

                <div className="col-span-2 text-center">  
                    <TitleHeading title={'Welcome to TAi!'} />
                </div> 
                
                ) : (  
                <>  
                    <div className="row-span-1 conte">   
                        <button 
                            className="custom-button-title"
                            onClick={ (e) => goBackPage(e)}
                            > 
                            <ArrowBackIcon />
                        </button>  
                    </div> 
                    <div className="row-span-2">
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