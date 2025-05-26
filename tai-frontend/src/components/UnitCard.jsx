import React from "react";   
import { useNavigate } from "react-router-dom"; 


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
            {/* Conditionally render based on null values */}
            {(!unitID || !unitName) && role === "teacher" ? (
                // Content to show when unitID or unitName is null (for teachers only)
                <button
                    className="bg-gray-200 bg-opacity-30 p-4 cursor-pointer flex flex-col items-center rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-400 hover:border-blue-500"
                //    TODO: Change this on click 
                    onClick={(e) => {goToPage(e)}}
                >
                    {/* Placeholder icon for empty unit */}
                    <div className="pb-2 rounded-md flex items-center justify-center">
                        <div className="w-52 h-52 rounded-md bg-gray-300 flex items-center justify-center">
                            <span className="text-4xl text-gray-500">+</span>
                        </div>
                    </div>
                    
                    <div className="border-2 border-white/30 rounded-md backdrop-blur-sm bg-white/10 flex-wrap">
                        <h3 className="p-2 rounded-md">
                            Create New Unit
                        </h3>
                    </div>
                </button>
            ) : (
                // Normal content when unitID and unitName are available
                <button
                    className="bg-blue-400 bg-opacity-30 p-4 cursor-pointer flex flex-col items-center rounded-[15px] transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-pink-400 hover:border-pink-500"
                    onClick={(e) => {goToPage(e)}}
                >
                    {/* Logo for the unit card */}
                    <div className="pb-2 rounded-md">
                        <img
                            className="w-52 h-52 rounded-md"
                            src={logo}
                            alt="Unit Logo" 
                        />
                    </div>
                    
                    {/* Unit name displayed on the card */}
                    <div className="border-2 border-white/30 rounded-md backdrop-blur-sm bg-white/10 flex-wrap">
                        <h3 className="p-2 rounded-md">
                            {unitName}
                        </h3>
                    </div>
                </button>
            )}
        </div>
    );
} 

export default UnitCard;