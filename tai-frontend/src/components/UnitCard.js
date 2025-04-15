import React from "react";   
import styles from './Components.css';

const UnitCard = ( {unitID, unitName, userID, role } ) => {   

    //TODO: change this for user 
    const logo = require("../images/example-class-logo.png");

    const goToPage = (e) => { 
        e.preventDefault(); 
        // Navigate here 
        // Should we split into Teacher/Student here?   
    }

    return(   
        <div className="card-button-outline"> 
            <button  
            className="card-button"
            onClick= { (e) => {goToPage(e)}}>   
            <img 
                className="card-image"
                src={logo} 
            />

            <div className="card-text-outline"> 
                {unitName} 
            </div> 

            </button> 
        </div>
        
    );
} 

export default UnitCard;