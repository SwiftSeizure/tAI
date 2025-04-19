import React from "react"; 

// Devide what we need to pass down to the module here maybe the entire module 
// then do all the conditionals to map it in here if the things exist 
const ModuleComponent = ( { module } ) => {   

    console.log("This is the data that is being passed into the module component: ", module)

    return ( 
        <>
        <div> 
            {module.name}
        </div>
        </>
    )

}; 

export default ModuleComponent;