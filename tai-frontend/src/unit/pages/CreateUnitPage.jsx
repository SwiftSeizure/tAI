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
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 bg-[length:200%_200%]" style={{animation: 'gradient-shift 18s ease-in-out infinite'}}>
                <NavBar title={"Unit Creation"} />   

                <div className="max-w-2xl mx-auto mt-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">

                        <form onSubmit={handleCreateUnit} className="space-y-8">   

                            {/* Unit Settings */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">
                                    Create a Unit
                                </h3>
                                
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Enter a name for your unit.
                                </p>
                                
                                <div className="space-y-2">
                                    <label
                                        htmlFor="unit-name-input"
                                        className="block text-sm font-semibold text-gray-900 dark:text-white"
                                    >
                                        Unit Name
                                    </label>
                                    <input
                                        id="unit-name-input"
                                        type="text"
                                        placeholder="Enter Unit Name"
                                        value={newUnitName}
                                        onChange={handleUnitNameChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                                                    dark:bg-gray-800 dark:text-white p-2.5 text-sm focus:ring-2 
                                                    focus:ring-blue-500 focus:outline-none transition-all duration-200
                                                    hover:border-gray-400 dark:hover:border-gray-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg 
                                             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                             focus:ring-blue-500 transition-colors duration-200 shadow-sm
                                             hover:shadow-md w-full sm:w-auto"
                                >
                                    Create Unit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}; 

export default CreateUnitPage;