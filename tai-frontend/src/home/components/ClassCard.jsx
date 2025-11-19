import React from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete'; 
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';

/**
 * ClassCard Component with Modern Animations
 */
const ClassCard = ( { 
    classroom, 
    onClick, 
    onClickSettings,
    admin,
    onClickDelete, 
    onClickRoster,
    onPublishClass
}  ) => {
    
    const handleClick = () => { 
        onClick(classroom);
    };

    const handleClickSettings = () => { 
        onClickSettings(classroom);
    }; 

    const handleClickDelete = () => { 
        onClickDelete(classroom);
    }; 

    const handleClickRoster = () => { 
        onClickRoster(classroom);
    };  

    const handleClickPublish = () => { 
        onPublishClass(classroom);
    }; 

    // Render "Add New Class" card
    if (classroom?.name === "newClass") {
        return (
            <div className="group relative max-w-sm bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-dashed border-blue-300 hover:border-blue-400 hover:from-blue-100 hover:to-indigo-100">
                <button onClick={handleClick} className="w-full">
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
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                            Add New Class
                        </h5>
                        <p className="mt-2 text-sm text-gray-600">
                            Create a new class to get started
                        </p>
                    </div>
                </button>
            </div>
            );
    }   

    // Normal class card with modern gradient animation
    return (
            <div className="group relative max-w-sm bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/80 hover:border-gray-300">
                {/* Animated Gradient Header */}
                <button onClick={handleClick} className="w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <div className="w-full h-56 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                        {/* Class Icon */}
                        <div className="relative">
                            <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40 group-hover:border-white/60 transition-all duration-300">
                                <SchoolIcon 
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
                    {/* Class Title */}
                    <h5 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 line-clamp-2">
                        {classroom?.name}
                    </h5>

                    {/* Admin Info Section */}
                    {admin && (
                        <div className="mb-4 space-y-2">
                            {/* Published Status Badge */}
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                    classroom?.published 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                    {classroom?.published ? (
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
                            {/* Class Code */}
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500 font-medium">Class Code:</span>
                                <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-mono text-xs font-semibold border border-gray-200">
                                    {classroom?.classCode}
                                </code>
                            </div>
                        </div>
                    )}

                    {/* Teacher Action Buttons */}
                    {admin && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                            {onClickSettings && (
                                <button 
                                    onClick={handleClickSettings}
                                    className="flex-1 min-w-[44px] p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-sm group/btn"
                                    title="Settings"
                                >
                                    <SettingsIcon 
                                        fontSize="small" 
                                        className="text-slate-600 group-hover/btn:text-slate-800 transition-colors"
                                    />
                                </button>
                            )}
                            {onClickDelete && classroom.id && (
                                <button 
                                    onClick={handleClickDelete}
                                    className="flex-1 min-w-[44px] p-2.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-sm group/btn"
                                    title="Delete Class"
                                >
                                    <DeleteIcon 
                                        fontSize="small" 
                                        className="text-red-600 group-hover/btn:text-red-700 transition-colors"
                                    />
                                </button>
                            )}
                            {onClickRoster && classroom.id && (
                                <button 
                                    onClick={handleClickRoster}
                                    className="flex-1 min-w-[44px] p-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 transition-all duration-200 hover:shadow-sm group/btn"
                                    title="View Roster"
                                >
                                    <PersonIcon 
                                        fontSize="small" 
                                        className="text-emerald-600 group-hover/btn:text-emerald-700 transition-colors"
                                    />
                                </button>
                            )}
                            {onPublishClass && classroom.id && (
                                <button 
                                    onClick={handleClickPublish}
                                    className="flex-1 min-w-[44px] p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-sm group/btn"
                                    title={classroom.published ? "Unpublish" : "Publish"}
                                >
                                    {classroom.published ? (
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
};

export default ClassCard;