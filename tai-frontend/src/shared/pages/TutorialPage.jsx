import React from 'react';
import { NavBarTeamPresence } from '../../shared/components/NavBarTeamPresence';
import { Youtube, Users, BookOpen } from 'lucide-react';

export default function TutorialPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <NavBarTeamPresence title="Tutorial" />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold text-gray-900">Getting Started Tutorial</h1>
                        <p className="text-xl text-gray-600">Learn How to Get the Most Out of TAi</p>
                    </div>

                    {/* Subtitle */}
                    <div className="border-t border-gray-200 pt-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Watch Our Complete Guide
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            The tutorial bellow will teach you everything you need to know about using our applicaiton. We are excited to have you and to continue promoting education.
                        </p>
                    </div>

                    {/* YouTube Video Link */}
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Youtube className="w-8 h-8 text-red-600" />
                            <h3 className="text-xl font-semibold text-gray-900">Video Tutorial</h3>
                        </div>
                        
                        {/* Video Embed Placeholder */}
                        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                            <div className="text-center space-y-2">
                                <Youtube className="w-16 h-16 text-gray-400 mx-auto" />
                                <p className="text-gray-500">YouTube Video Embed</p>
                                <p className="text-sm text-gray-400">Replace with actual video URL</p>
                            </div>
                        </div>

                        <a 
                            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium 
                                     rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                            <Youtube className="w-5 h-5" />
                            Watch on YouTube
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                        <a 
                            href="/team" 
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg 
                                     hover:bg-blue-200 transition-colors duration-200"
                        >
                            <Users className="w-4 h-4" />
                            Meet the Team
                        </a>
                        <a 
                            href="/members" 
                            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg 
                                     hover:bg-purple-200 transition-colors duration-200"
                        >
                            <BookOpen className="w-4 h-4" />
                            Team Members
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}