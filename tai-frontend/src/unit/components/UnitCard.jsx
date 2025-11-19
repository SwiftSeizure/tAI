import React from "react";   
import { useCurrentUser } from "../../store/user-store";  
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MenuBookIcon from '@mui/icons-material/MenuBook';

/**
 * UnitCard Component with Modern Animations
 */

const UnitCard = ( {unit, onClick, onClickDelete, onClickPublish } ) => {   

    const { user } = useCurrentUser();

    const handleOnClick = () => { 
        onClick(unit);
    };  

    const handleClickDelete = () => { 
        onClickDelete(unit);
    };  

    const handleOnPublish = () => { 
        onClickPublish(unit);
    }; 

    // Render "Create New Unit" card for teachers when no unit
    if (!unit && user.role === "teacher") {
        return (
            <div className="group relative max-w-sm bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-dashed border-blue-300 hover:border-blue-400 hover:from-blue-100 hover:to-indigo-100">
                <button onClick={handleOnClick} className="w-full">
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent z-10"></div>
                        <div className="w-full h-56 bg-gray-200 flex items-center justify-center opacity-60 group-hover:opacity-80 transition-all duration-500">
                            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-20">
                                <svg 
                                    className="w-10 h-10 text-blue-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <h3 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                            Create New Unit
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Add a unit to organize your content
                        </p>
                    </div>
                </button>
            </div>
        );
    }

    // Normal unit card with modern gradient animation
    return (
        <div className="group relative max-w-sm bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/80 hover:border-gray-300">
            {/* Animated Gradient Header */}
            <button onClick={handleOnClick} className="w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <div className="w-full h-56 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    {/* Unit Icon */}
                    <div className="relative">
                        <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40 group-hover:border-white/60 transition-all duration-300">
                            <MenuBookIcon 
                                sx={{ fontSize: 64 }} 
                                className="text-white drop-shadow-lg"
                            />
                        </div>
                        {/* Animated pulse ring */}
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-75"></div>
                    </div>
                </div>
            </button>

            {/* Content */}
            <div className="p-6">
                {/* Unit Title */}
                <h3 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 line-clamp-2">
                    {unit.name}
                </h3>

                {/* Admin Info Section */}
                {user.role === "teacher" && (
                    <div className="mb-4 space-y-2">
                        {/* Published Status Badge */}
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                unit?.published 
                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                                {unit?.published ? (
                                    <>
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Published
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                        Not Published
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                )}

                {/* Teacher Action Buttons */}
                {user.role === "teacher" && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                        {onClickDelete && unit && (
                            <button 
                                onClick={handleClickDelete}
                                className="flex-1 min-w-[44px] p-2.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-sm group/btn"
                                title="Delete Unit"
                            >
                                <DeleteIcon 
                                    fontSize="small" 
                                    className="text-red-600 group-hover/btn:text-red-700 transition-colors"
                                />
                            </button>
                        )}
                        {onClickPublish && unit && (
                            <button 
                                onClick={handleOnPublish}
                                className="flex-1 min-w-[44px] p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-sm group/btn"
                                title={unit.published ? "Unpublish" : "Publish"}
                            >
                                {unit.published ? (
                                    <VisibilityIcon 
                                        fontSize="small" 
                                        className="text-blue-600 group-hover/btn:text-blue-700 transition-colors"
                                    />
                                ) : (
                                    <VisibilityOffIcon 
                                        fontSize="small" 
                                        className="text-blue-600 group-hover/btn:text-blue-700 transition-colors"
                                    />
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 

export default UnitCard;