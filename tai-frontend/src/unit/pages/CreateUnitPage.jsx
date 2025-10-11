import React, { useState } from "react"; 
import { NavBar } from "../../shared/components/NavBar"; 
import { useLocation, useNavigate } from "react-router-dom";   
import { useCurrentClass } from "../../store/class-store"; 
import { postNewUnit } from "../services/post-new-unit";
import { useUnit } from "../../store/unit-store";
import { useCurrentUnit } from "../../store/unit-store";

const CreateUnitPage = () => {    
    const [newUnitName, setNewUnitName] = useState("");

    const location = useLocation();  
    const { currentClass } = useCurrentClass();  

    const [state, { setCurrentUnit, fetchUnits }] = useUnit();
    const { currentUnit } = useCurrentUnit();

    const navigate = useNavigate(); 

    const handleCreateUnit = async (e) => { 
        e.preventDefault();  

        const response = await postNewUnit(currentClass.id, newUnitName);  

        if (response.success) { 
            await fetchUnits(currentClass.id);
            await setCurrentUnit(response.data.id); 
            navigate(`/modulepage`);
        }
    };

    const handleUnitNameChange = (e) => {
        setNewUnitName(e.target.value);
    };

    return( 
        <>
            <NavBar title={"Unit Creation"} />   

            <form onSubmit={handleCreateUnit} className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 space-y-6">   

                {/* Unit Settings */}
                <div className="w-full max-w-2xl">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                        Create a Unit
                    </h3>
                    
                    <div className="space-y-5">
                        <p className="text-base text-gray-600 dark:text-gray-400 text-center">
                            Enter a name for your unit.
                        </p>
                        
                        <div className="space-y-3">

                            <input
                                id="unit-name-input"
                                type="text"
                                placeholder="New Unit Name"
                                value={newUnitName}
                                onChange={handleUnitNameChange}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                                            dark:bg-gray-800 dark:text-white p-4 text-base focus:ring-2 
                                            focus:ring-blue-500 focus:outline-none transition-all duration-200
                                            hover:border-gray-400 dark:hover:border-gray-500"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="inline-block w-[200px] cursor-pointer border-2 border-gray-300 rounded-lg p-4 m-2 bg-transparent
                             font-medium text-[1.1rem] text-gray-800 text-center font-nunito
                             transition-all duration-300 ease-in-out
                             hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg
                             active:-translate-y-0.5 active:shadow-md
                             focus:outline-none focus:outline-offset-2"
                >
                    Create Unit
                </button>
            </form>
        </>
    );
}; 

export default CreateUnitPage;