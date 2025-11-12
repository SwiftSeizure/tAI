import React from 'react';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';

const StatisticsCard = ({ classData, onClick }) => {

    return (
        <div className={`group relative max-w-sm bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/80 hover:border-blue-300`}>
            {/* Header Section with Icon */}
            <button onClick={onClick} className="w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <div className="w-full h-56 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    {/* Stats Icon */}
                    <div className="relative">
                        <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/40 group-hover:border-white/60 transition-all duration-300">
                            <BarChartIcon 
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
                {/* Title */}
                <h3 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                    {classData.name}'s Statistics
                    <TrendingUpIcon className="text-blue-600" fontSize="small" />
                </h3>

                {/* Description */}
                <p className="mb-4 text-sm text-gray-600 leading-relaxed">
                    Student performance and engagement analytics
                </p>

                {/* Quick Stats Preview */}
                {/* <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                            <PeopleIcon fontSize="small" className="text-blue-500" />
                            Total Students
                        </span>
                        <span className="font-semibold text-gray-900">--</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                            <BarChartIcon fontSize="small" className="text-green-500" />
                            Avg. Progress
                        </span>
                        <span className="font-semibold text-gray-900">--%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                            <TrendingUpIcon fontSize="small" className="text-purple-500" />
                            Engagement
                        </span>
                        <span className="font-semibold text-gray-900">--</span>
                    </div>
                </div> */}

                {/* View Details Button */} 
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    <button 
                        onClick={onClick}
                        className="w-full py-3 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-700 font-medium text-sm transition-all duration-200 hover:shadow-sm group/btn flex items-center justify-center"
                    >
                        <div className="flex items-center justify-center">
                            <BarChartIcon fontSize="small" />
                            <span>View Detailed Statistics</span>
                        </div>
                    </button> 
                </div>
            </div>
        </div>
    );
};

export default StatisticsCard;