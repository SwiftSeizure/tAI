import React from "react";  
import { useNavigate } from "react-router-dom"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';   
import headers from "../CSS/Headers.css"

const TitleCard = ( { title  } ) => {   


    const navigate = useNavigate(); 


    const goBackPage = (e) => {  
        e.preventDefault();
        
        navigate(-1);

    };

    
    return( 
        <>   
        <div className="title-card-center"> 

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