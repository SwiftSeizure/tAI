import React from "react";   


const UnitCard = ( {unitID, unitName, userID, role } ) => {   




    const goToPage = (e) => { 
        e.preventDefault(); 
        // Navigate here 
        // Should we split into Teacher/Student here?   

    }

    return(   
        <div> 
            <button onClick= { (e) => {goToPage(e)}}>   

                <h5> {unitName} </h5>
            </button> 
        </div>
        
    );
} 

export default UnitCard;