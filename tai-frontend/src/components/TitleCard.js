import React from "react";  
import styles from './Components.css'; 
import { useNavigate } from "react-router-dom"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



const TitleCard = ( { title  } ) => {  

    const navigate = useNavigate(); 


    //TODO: Add back button  

    const goBackPage = (e) => {  
        e.preventDefault();
        

        navigate(-1);

    };

    
    return( 
        <>  

        <div className="title-card-center"> 
            <button 
                className="title-card-back-button"
                onClick={ (e) => goBackPage(e)}
                > 
                <ArrowBackIcon />
            </button>
            <h1 className="title-card-h1"> {title} </h1> 
        </div>
        </>  
    );
    
}; 

export default TitleCard;