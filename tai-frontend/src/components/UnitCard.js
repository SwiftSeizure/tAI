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
        <div className="overflow-hidden p-12">  
            {/* Button to navigate to the module page */}
            <button  
                className="bg-blue-400 bg-opacity-30 p-4 cursor-pointer flex flex-col items-center rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-pink-400 hover:border-pink-500"
                onClick= { (e) => {goToPage(e)}}  // Handle click event to navigate
                >   
                {/* Logo for the unit card */}
                <div className="pb-2 rounded-md"> 
                    <img  
                        className="w-52 h-52 rounded-md "  
                        src={logo} 
                        alt="Unit Logo" />
                </div>

                {/* Unit name displayed on the card TODO: Fix this font!!!!!!!*/}
                <div className="border-2 border-white/30 rounded-md backdrop-blur-sm bg-white/10 flex-wrap" >  
                    <h3 className="p-2 rounded-md" > 
                        {unitName} 
                    </h3> 
                </div> 
            </button> 
        </div>
        
    );
} 

export default UnitCard;