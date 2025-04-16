import React from "react";  
import styles from './Components.css';

const TitleCard = ( { title } ) => { 


    //TODO: Add back button 

    
    return( 
        <>  

        <div className="title-card-center"> 
            <button> Go back </button>
            <h1 className="title-card-h1"> {title} </h1> 
        </div>
        </>  
    );
    
}; 

export default TitleCard;