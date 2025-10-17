import React, { useEffect, useState } from "react";  
import { FaFile, FaTrash } from "react-icons/fa";
import { MdAssignment } from "react-icons/md"; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { useCurrentUser } from "../../store/user-store"; 
import { useDay } from "../../store/day-store"; 


import { getDayAssignments } from "../services/get-day-assignments"; 
import { getDayMaterials } from "../services/get-day-materials";

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

const DayComponent = ( {
    day,
    onDaySelect,
    onMaterialSelect, 
    onAssignmentSelect, 
    handleAddMaterial, 
    handleAddAssignment, 
    handleOnClickDeleteDay, 
    handleOnClickDeleteMaterial, 
    handleOnClickDeleteAssignment,
    refreshKey = 0,  // Add refreshKey prop to trigger data refresh
    selectedContent = null  // Add selectedContent prop
}  ) => { 

    // State to store materials and assignments for the day
    const [materials, setMaterials] = useState([]);   

    // State to store assignments for the day
    const [assignments, setAssignments] = useState([]);

    const [selected, setSelected] = useState([null]); 

    // State to store loading state
    const [loading, setLoading] = useState(false); 

    // Use day store: get state and actions
    const [dayState, dayActions] = useDay();
    const { selectedDay } = dayState;
    const { setSelectedDay } = dayActions;

    const { user } = useCurrentUser();

    const handleDaySelect = () => {
        onDaySelect(day);
    }; 

    const handleDayClicked = (e) => {
        // Set this day as the globally selected day 
        if (selectedDay?.id === day?.id) {
            setSelectedDay(null);
            return;
        }
        setSelectedDay(day);
        handleDaySelect();
    };

    /**
     * toggleExpand
     * Toggles the expanded state of the day. If expanding for the first time,
     * it fetches materials and assignments for the day from the API.
     */
    // Determine if this day is the currently selected/expanded day
    const isExpanded = selectedDay?.id === day?.id;

    // When this day becomes selected, fetch its materials and assignments
    useEffect(() => {
        let isCancelled = false;

        const fetchData = async () => {
            if (!isExpanded || !day || loading) return;
            setLoading(true);
            try {
                const [materials, assignments] = await Promise.all([
                    getDayMaterials(day),
                    getDayAssignments(day)
                ]);
                if (!isCancelled) {
                    setMaterials(materials || []);
                    setAssignments(assignments || []);
                }
            } catch (error) {
                console.log(error);
            } finally {
                if (!isCancelled) setLoading(false);
            }
        };

        // Clear previous data when switching selection to avoid stale display
        if (isExpanded) {
            setMaterials([]);
            setAssignments([]);
            fetchData();
        }

        return () => {
            isCancelled = true;
        };
    }, [isExpanded, day?.id, refreshKey]);  // Add refreshKey to dependencies


    return (
        <div className={`p-3 m-2 rounded-xl font-nunito ease-in-out duration-300 opacity-0 animate-fade-in-slide-up transform border shadow-sm
            ${isExpanded
              ? "bg-gradient-to-r from-green-400/35 to-emerald-400/65 border-green-300 font-bold pb-4 text-white shadow-md"
              : "bg-white border-gray-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-300 hover:font-semibold hover:scale-[1.01] text-gray-700 hover:shadow-md"}
          `}
            onClick={handleDayClicked}>
                <h4 className={`pl-4 text-lg transition-colors duration-300 ${isExpanded ? "pb-3 font-bold text-white" : "pb-0 font-semibold"}`}>
                    {day?.name} 
                </h4>

            {/* Content section for the day */}
            {isExpanded && (
                <div className="p-2 bg-white rounded-lg">
                    {loading ? (
                        <div className="flex items-center pl-4 gap-3">
                            <div className="w-5 h-5 border-[3px] border-blue-400 border-opacity-30 border-t-blue-500 rounded-full animate-spin"></div>
                            <span>Loading resources...</span>
                        </div>
                    ) : (
                        <AnimatePresence>
                            <>
                            {user.role === "teacher" && (
                                <button 
                                    onClick={() => handleOnClickDeleteDay(day)}
                                    className="mb-3 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                                >
                                    Delete Day
                                </button>
                            )}
                                {materials && materials.length > 0 && (
                                    <motion.div 
                                        key="materials-section"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <h5 className="font-nunito font-bold text-md text-gray-500 uppercase tracking-wide m-2">
                                            Materials
                                        </h5>
                                        <ul>
                                            {materials.map(material => (
                                                <li key={`material-${material.id}`}> 
                                                    <button
                                                        className={`flex items-center py-3 ml-1 mr-3 px-4 rounded-xl bg-white border hover:translate-x-1 ease-in-out duration-300 w-full max-w-[calc(100%-1rem)] shadow-sm hover:shadow-md ${selectedContent && selectedContent.name === material.name ? 'bg-blue-50 border-blue-300 translate-x-1 shadow-md' : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onMaterialSelect(day.id, material);
                                                        }}
                                                    >
                                                        <FaFile className="mr-3 text-base text-green-500 flex-shrink-0" />
                                                        <span className="font-sans text-sm text-gray-700 font-medium tracking-wide truncate">{material.name}</span>
                                                    </button> 
                                                    {user.role === "teacher" && (
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.stopPropagation();
                                                                handleOnClickDeleteMaterial(material); 
                                                                setSelectedDay(day); 
                                                            }} 
                                                            className="ml-2 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 group"
                                                            title="Delete Material"
                                                            > 
                                                            <FaTrash className="text-sm text-red-400 group-hover:text-red-600 transition-colors" />
                                                        </button>
                                                    )}
                                                </li> 
                                                
                                            ))}
                                        </ul> 
                                    </motion.div>
                                )} 
                                {user.role === "teacher" && (
                                    <button 
                                        className="flex items-center py-3 ml-1 px-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 hover:from-green-200 hover:to-emerald-200 hover:border-green-300 hover:translate-x-1 ease-in-out duration-300 shadow-sm hover:shadow-md"
                                        onClick={ (e) => {
                                            e.stopPropagation();
                                            handleAddMaterial(day.id)
                                        }}
                                    >
                                        <span className="font-sans text-sm text-green-700 font-semibold tracking-wide">+ Add Material</span>
                                    </button> 
                                )}
            
                                {assignments && assignments.length > 0 && (
                                    <motion.div 
                                        key="assignments-section"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <h5 className="font-nunito font-bold text-md text-gray-500 uppercase tracking-wide m-2">
                                            Assignments
                                        </h5>
                                        <ul>
                                            {assignments.map(assignment => (
                                                <li key={`assignment-${assignment.id}`} > 
                                                    <button
                                                        className={`flex items-center py-3 ml-1 mr-3 px-4 rounded-xl bg-white border hover:translate-x-1 ease-in-out duration-300 w-full max-w-[calc(100%-1rem)] shadow-sm hover:shadow-md ${selectedContent && selectedContent.name === assignment.name ? 'bg-blue-50 border-blue-300 translate-x-1 shadow-md' : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onAssignmentSelect(day.id, assignment); 
                                                            setSelectedDay(day); 
                                                        }} 
                                                    >
                                                
                                                        <MdAssignment className="mr-3 text-base text-emerald-500 flex-shrink-0" />
                                                        <span className="font-sans text-sm text-gray-700 font-medium tracking-wide truncate">{assignment.name}</span>
                                                    </button> 
                                                    {user.role === "teacher" && (
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.stopPropagation();
                                                                handleOnClickDeleteAssignment(assignment)
                                                            }} 
                                                            className="ml-2 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 group"
                                                            title="Delete Assignment"
                                                        > 
                                                            <FaTrash className="text-sm text-red-400 group-hover:text-red-600 transition-colors" />
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul> 
                                    </motion.div>
                                )}  
                                {user.role === "teacher" && (
                                    <button 
                                        className="flex items-center py-3 ml-1 px-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 hover:from-green-200 hover:to-emerald-200 hover:border-green-300 hover:translate-x-1 ease-in-out duration-300 shadow-sm hover:shadow-md"
                                        onClick={ (e) => {
                                            e.stopPropagation();
                                            handleAddAssignment(day.id); 
                                        }}
                                    >
                                        <span className="font-sans text-sm text-green-700 font-semibold tracking-wide">+ Add Assignment</span>
                                    </button>
                                )}
                            </>
                        </AnimatePresence>
                    )}
                </div>
            )}
        </div>
      );
    };

export default DayComponent;