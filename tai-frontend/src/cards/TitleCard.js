import React from "react";  
import styles from './Cards.css';

const TitleCard = ( { title } ) => { 


    return( 
        <> 
        <div className="title-card-center">
            <h1 className="title-card-h1"> {title} </h1> 
        </div>
        </>  
    );
    
}; 

export default TitleCard;