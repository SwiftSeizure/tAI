import React, { useEffect, useState } from "react";  
import { FaFile } from "react-icons/fa";
import { MdAssignment } from "react-icons/md"; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { useCurrentUser } from "../../store/user-store"; 
import { useDay } from "../../store/day-store"; 
import DeleteIcon from '@mui/icons-material/Delete';


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
                console.error(error);
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
        <div className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border
            ${isExpanded
              ? "bg-green-500 border-green-500 text-white shadow-sm"
              : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"}
          `}
            onClick={handleDayClicked}>
                <h4 className={`font-semibold text-sm transition-colors duration-200 ${isExpanded ? "text-white mb-3" : "text-gray-900"}`}>
                    {day?.name} 
                </h4>

            {/* Content section for the day */}
            {isExpanded && (
                <div className="bg-white rounded-lg p-3">
                    {loading ? (
                        <div className="flex items-center gap-3 text-gray-600">
                            <div className="w-5 h-5 border-[3px] border-blue-400 border-opacity-30 border-t-blue-500 rounded-full animate-spin"></div>
                            <span className="text-sm">Loading resources...</span>
                        </div>
                    ) : (
                        <AnimatePresence>
                            <>
                            {user.role === "teacher" && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOnClickDeleteDay(day);
                                    }}
                                    className="mb-3 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors duration-200"
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
                                        transition={{ duration: 0.3 }}
                                        className="mb-3"
                                    >
                                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                            Materials
                                        </h5>
                                        <ul className="space-y-1.5">
                                            {materials.map(material => (
                                                <li key={`material-${material.id}`} className="flex items-center gap-1"> 
                                                    <button
                                                        className={`flex items-center gap-2 py-2 px-3 rounded-lg border transition-all duration-200 flex-1 min-w-0 ${selectedContent && selectedContent.name === material.name ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onMaterialSelect(day.id, material);
                                                        }}
                                                    >
                                                        <FaFile className="text-sm text-green-500 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700 font-medium truncate block min-w-0">{material.name}</span>
                                                    </button> 
                                                    {user.role === "teacher" && (
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.stopPropagation();
                                                                handleOnClickDeleteMaterial(material); 
                                                                setSelectedDay(day); 
                                                            }} 
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                                                            title="Delete Material"
                                                        > 
                                                            <DeleteIcon sx={{ fontSize: 18 }} />
                                                        </button>
                                                    )}
                                                </li> 
                                                
                                            ))}
                                        </ul> 
                                    </motion.div>
                                )} 
                                {user.role === "teacher" && (
                                    <button 
                                        className="mb-3 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-colors duration-200 w-full"
                                        onClick={ (e) => {
                                            e.stopPropagation();
                                            handleAddMaterial(day.id)
                                        }}
                                    >
                                        + Add Material
                                    </button> 
                                )}
            
                                {assignments && assignments.length > 0 && (
                                    <motion.div 
                                        key="assignments-section"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mb-3"
                                    >
                                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                            Assignments
                                        </h5>
                                        <ul className="space-y-1.5">
                                            {assignments.map(assignment => (
                                                <li key={`assignment-${assignment.id}`} className="flex items-center gap-1"> 
                                                    <button
                                                        className={`flex items-center gap-2 py-2 px-3 rounded-lg border transition-all duration-200 flex-1 min-w-0 ${selectedContent && selectedContent.name === assignment.name ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onAssignmentSelect(day.id, assignment); 
                                                            setSelectedDay(day); 
                                                        }} 
                                                    >
                                                
                                                        <MdAssignment className="text-sm text-emerald-500 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700 font-medium truncate block min-w-0">{assignment.name}</span>
                                                    </button> 
                                                    {user.role === "teacher" && (
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.stopPropagation();
                                                                handleOnClickDeleteAssignment(assignment)
                                                            }} 
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                                                            title="Delete Assignment"
                                                        > 
                                                            <DeleteIcon sx={{ fontSize: 18 }} />
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul> 
                                    </motion.div>
                                )}  
                                {user.role === "teacher" && (
                                    <button 
                                        className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-colors duration-200 w-full"
                                        onClick={ (e) => {
                                            e.stopPropagation();
                                            handleAddAssignment(day.id); 
                                        }}
                                    >
                                        + Add Assignment
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