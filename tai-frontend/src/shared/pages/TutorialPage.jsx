import React, { useState } from 'react';
import { NavBarTeamPresence } from '../../shared/components/NavBarTeamPresence';
import { Youtube, Users, BookOpen, GraduationCap, UserCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function TutorialPage() {
    const [expandedSection, setExpandedSection] = useState('teacher');

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <NavBarTeamPresence title="Tutorial" />
            
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold text-gray-900">Getting Started with TAi</h1>
                        <p className="text-xl text-gray-600">Learn How to Get the Most Out of Our Platform</p>
                    </div>

                    {/* Introduction */}
                    <div className="border-t border-gray-200 pt-6">
                        <p className="text-gray-700 leading-relaxed text-center">
                            The tutorials below will teach you everything you need to know about using our application. 
                            We are excited to have you and to continue promoting education.
                        </p>
                    </div>

                    {/* Tutorial Sections */}
                    <div className="space-y-4"> 


                        {/* Everyone Tutorial */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => toggleSection('everyone')}
                                className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-8 h-8 text-green-600" />
                                    <div className="text-left">
                                        <h2 className="text-2xl font-bold text-gray-900"> Everyone </h2>
                                        <p className="text-sm text-gray-600">Best practices for all users</p>
                                    </div>
                                </div>
                                {expandedSection === 'everyone' ? (
                                    <ChevronUp className="w-6 h-6 text-gray-600" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 text-gray-600" />
                                )}
                            </button>
                            
                            {expandedSection === 'everyone' && (
                                <div className="p-6 bg-white space-y-4">
                                    {/* Bullet Point Items */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1"> Create Your Account</h3>
                                            <p className="text-gray-700">Click on the get started button on the home page to create your account.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Edit Your Profile </h3>
                                            <p className="text-gray-700"> Click on the profile icon in the top right to change your display name, and associated email address.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div> 

                        {/* Teacher Tutorial */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => toggleSection('teacher')}
                                className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="w-8 h-8 text-blue-600" />
                                    <div className="text-left">
                                        <h2 className="text-2xl font-bold text-gray-900">Teacher Tutorial</h2>
                                        <p className="text-sm text-gray-600">Set up your classroom and manage students</p>
                                    </div>
                                </div>
                                {expandedSection === 'teacher' ? (
                                    <ChevronUp className="w-6 h-6 text-gray-600" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 text-gray-600" />
                                )}
                            </button>
                            
                            {expandedSection === 'teacher' && (
                                <div className="p-6 bg-white space-y-6">
                                    {/* Step 1 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Login to Your Account</h3>
                                            <p className="text-gray-700">Click login and enter your user credentials to access the platform.</p>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                            2
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Create a New Classroom</h3>
                                            <p className="text-gray-700">
                                                Create a new classroom and set your desired chat settings. If you have a Canvas class, 
                                                follow the on-screen instructions to import it directly.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Organize Your Content</h3>
                                            <p className="text-gray-700">
                                                Add your desired units, modules, and days. Then upload your materials and assignments 
                                                for each section to build your course structure.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 4 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                            4
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Share Class Code with Students</h3>
                                            <p className="text-gray-700">
                                                Find your class code on the class home page and share it with your students so they 
                                                can join and interact with the class.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 5 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                            5
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Monitor Student Progress</h3>
                                            <p className="text-gray-700">
                                                Access student statistics by navigating to your class and going to the student 
                                                statistics card. Click on pie charts to drill down into more detailed information.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Student Tutorial */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => toggleSection('student')}
                                className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <UserCircle className="w-8 h-8 text-purple-600" />
                                    <div className="text-left">
                                        <h2 className="text-2xl font-bold text-gray-900">Student Tutorial</h2>
                                        <p className="text-sm text-gray-600">Join classes and get AI-powered help</p>
                                    </div>
                                </div>
                                {expandedSection === 'student' ? (
                                    <ChevronUp className="w-6 h-6 text-gray-600" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 text-gray-600" />
                                )}
                            </button>
                            
                            {expandedSection === 'student' && (
                                <div className="p-6 bg-white space-y-6">
                                    {/* Step 1 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Login to Your Account</h3>
                                            <p className="text-gray-700">Click login and enter your user credentials to access the platform.</p>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                            2
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Join a Classroom</h3>
                                            <p className="text-gray-700">
                                                Add a classroom using the class code provided by your teacher.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Navigate Course Content</h3>
                                            <p className="text-gray-700">
                                                Browse through your course by selecting units, modules, and days to find the 
                                                materials and assignments you need.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 4 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                            4
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Get AI Teaching Assistant Help</h3>
                                            <p className="text-gray-700">
                                                When viewing a material or assignment, press the chat button in the bottom right 
                                                corner to open your helpful AI teaching assistant.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 5 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                            5
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Practice with AI-Generated Problems</h3>
                                            <p className="text-gray-700">
                                                In the chat, click "Practice Level 1" to generate practice problems based on the 
                                                material you're viewing. Keep answering questions correctly to level up and increase 
                                                the difficulty.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
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