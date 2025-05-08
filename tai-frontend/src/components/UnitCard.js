import React from "react";   
import { useNavigate } from "react-router-dom"; 
import cardLayouts from "../CSS/CardLayouts.css"; 


/**
 * UnitCard Component
 * This component represents a card for a unit. It displays the unit name and logo,
 * and allows navigation to the module page for the selected unit.
 * 
 * Props:
 * - unitID: Unique identifier for the unit.
 * - unitName: Name of the unit to display on the card.
 * - userID: ID of the current user.
 * - role: Role of the user (e.g., "teacher" or "student").
 */

const UnitCard = ( {unitID, unitName, userID, role } ) => {   

    // Placeholder logo for the unit card 
    // TODO: Change this so that it pulls the logo from the backend
    const logo = require("../images/example-class-logo.png"); 

    // Hook to navigate to the ModulePage
    const navigate = useNavigate();    


    /**
     * goToPage
     * Navigates the user to the module page for the selected unit.
     * Passes unitID, unitName, userID, and role as state to the next page.
     * @param {Event} e - The click event
     */
    const goToPage = (e) => { 
        e.preventDefault(); 
        navigate('/modulepage', {state: { unitID, unitName, userID, role }});      
    }


    return(   
        <div className="card-button-outline">  
            {/* Button to navigate to the module page */}
            <button  
                className="card-button"
                onClick= { (e) => {goToPage(e)}}  // Handle click event to navigate
                >   
                {/* Logo for the unit card */}
                <img 
                    className="card-image"
                    src={logo} 
                />

                {/* Unit name displayed on the card TODO: Fix this font!!!!!!!*/}
                <div className="card-text-outline"> 
                    {unitName} 
                </div> 
            </button> 
        </div>
        
    );
} 

export default UnitCard;