import React, {useState} from "react";  
import { getRequest } from "../../API"; 
import { FaChevronDown, FaChevronUp, FaFile, FaClipboard } from "react-icons/fa";
import { MdAssignment } from "react-icons/md"; 
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DayComponent
 * This component represents a single day in a schedule or calendar.
 * It allows users to expand the day to view associated materials and assignments.
 * Props:
 * - day: Object containing information about the day (id, name, materials, assignments).
 * - onDaySelect: Callback function triggered when a day is selected (used in ModuleComponent).
 * - onMaterialSelect: Callback function triggered when a material is selected.
 * - onAssignmentSelect: Callback function triggered when an assignment is selected.
 */ 

const DayComponent = ( {day, onDaySelect, onMaterialSelect, onAssignmentSelect}  ) => { 

    // State to track whether the day is expanded or not
    const [isExpanded, setIsExpanded] = useState(false);   

    // State to store materials and assignments for the day
    const [materials, setMaterials] = useState([]);   

    // State to store assignments for the day
    const [assignments, setAssignments] = useState([]) 

    const [selected, setSelected] = useState([null]);

    // State to store loading state
    const [loading, setLoading] = useState(false);


    /**
     * toggleExpand
     * Toggles the expanded state of the day. If expanding for the first time,
     * it fetches materials and assignments for the day from the API.
     */
    const toggleExpand = async () =>  { 
        const newExpandedState = !isExpanded;
        setIsExpanded(newExpandedState); 

        // Fetch materials and assignments only if expanding for the first time
        if (newExpandedState && materials.length === 0 && !loading) {  
            setLoading(true); 

            try {   
                // Fetch Materials
                const urlMaterial = `/day/${day.id}/materials`; 
                const responseMaterial = await getRequest(urlMaterial); 
                setMaterials(responseMaterial.data.materials);  

                // Fetch Assignments 
                const urlAssignment = `/day/${day.id}/assignments`; 
                const responseAssignment = await getRequest(urlAssignment);  
                setAssignments(responseAssignment.data.assignments);
            }  

            // Handle errors during API requests
            catch (error) { 
                console.log(error);
            }  

            // Reset loading state
            finally { 
                setLoading(false);
            }
        }  


    };


    return (
        <div className={`p-2 m-2 rounded-lg font-nunito text-[#2c3e50] ease-in-out duration-300 opacity-0 animate-fade-in-slide-up transform
            ${isExpanded
              ? "bg-pink-400 border-pink-400 font-bold pb-3"
              : "bg-blue-400 bg-opacity-30 hover:bg-pink-400 hover:border-pink-500 hover:font-bold hover:scale-105"}
          `}
            onClick={toggleExpand} >
                <h4 className={` pl-4 ${isExpanded ? "pb-2 font-bold": "pb-0"} `}>
                    {day?.name} 
                </h4>

            {/* Content section for the day */}
            {isExpanded && (
                <div className="p-2 bg-white rounded-lg"> 

                    {/* Display loading spinner while fetching data */}
                    {loading ? (
                        <div className="flex items-center pl-4 gap-3">
                            <div className="w-5 h-5 border-[3px] border-blue-400 border-opacity-30 border-t-blue-500 rounded-full animate-spin"></div>
                            <span>Loading resources...</span>
                        </div>
                    ) : (
                        <> 
                        {/* Display materials if available */}
                        {materials && materials.length > 0 && (
                            <AnimatePresence> 
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                <h5 className="font-nunito font-bold text-md text-gray-500 uppercase tracking-wide m-2 ">
                                    Materials
                                </h5>
                                <ul className=""> 
                                    { /* Map through materials and display them */}
                                    {materials.map(material => (
                                        <li
                                            key={material.id}
                                            className={`flex items-center pt-2 pb-3 ml-1 pl-2 rounded-md bg-slate-300 hover:translate-x-1 ease-in-out duration-300 ${material.name === selected ? 'bg-slate-400 translate-x-1' : ''} `}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onMaterialSelect(day.id, material.id, material.filename, material.name);
                                                setSelected(material.name)}}
                                        >
                                            <FaFile className="mr-3 text-base text-yellow-500" />
                                            <span className="font-sans text-sm text-gray-600 font-md tracking-wide">{material.name}</span>
                                        </li>
                                    ))}
                                </ul> 
                                </motion.div>
                            </AnimatePresence>
                        )} 
                        {/* Display assignments if available */}
                        {assignments && assignments.length > 0 && (
                            <AnimatePresence> 
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                <h5 className="font-nunito font-bold text-md text-gray-500 uppercase tracking-wide m-2 ">Assignments</h5>
                                <ul className=""> 
                                    { /* Map through assignments and display them */}
                                    {assignments.map(assignment => (
                                        <li
                                            key={assignment.id}
                                            className={`flex items-center pt-2 pb-3 ml-1 pl-2 rounded-md bg-slate-300 hover:translate-x-1 ease-in-out duration-300 ${assignment.name === selected ? 'bg-slate-400 translate-x-1' : ''} `}
                                            onClick={(e) => { 
                                                e.stopPropagation();
                                                onAssignmentSelect(day.id, assignment.id, assignment.filename, assignment.name); 
                                                setSelected(assignment.name); }}
                                        >   
                                            <MdAssignment className="mr-3 text-base text-red-500" />
                                            <span className="font-sans text-sm text-gray-600 font-md tracking-wide">{assignment.name}</span>
                                        </li>
                                    ))}
                                </ul>
                                </motion.div>
                            </AnimatePresence>
                        )} 
                        {/* Display message if no resources are available */}
                        {(!materials || materials.length === 0) && (!assignments || assignments.length === 0) && (
                            <p className="no-resources-message">No resources available for this day.</p>
                        )}
                        </>
                    )}
                </div>
            )}
        </div>
      );
    };

export default DayComponent;