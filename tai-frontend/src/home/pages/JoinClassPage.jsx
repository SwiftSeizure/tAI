import React, { useState } from "react";
import { NavBar } from "../../shared/components/NavBar";  
import { useNavigate } from "react-router-dom"; 
import { postJoinClass } from "../services/post-join-class";
import { useClass } from "../../store/class-store";
import { useCurrentUser } from "../../store/user-store";
import { ensureStudentExists } from "../services/ensure-student-exists";

/**
 * JoinClassPage Component
 * This page allows students to join a class by entering a class code.
 * It includes a title card, an input field for the class code, and a button to submit the code.
 */

const JoinClassPage = () => {  

    // TODO: Add the functionality to join a class here  
    const [classCode, setClassCode] = useState(""); 
    const [, { fetchClasses, setCurrentClass } ] = useClass();   
    const { user } = useCurrentUser(); 
    const navigate = useNavigate();  

    const handleJoinClass = async (e) => { 
        e.preventDefault(); 

       try {
            console.log("Attempting to join class with:", { 
                studentID: user.id, 
                classCode: classCode,
                userRole: user.role,
                userName: user.name 
            });

            // Ensure the student exists in the database before trying to enroll
            if (user.role === 'student') {
                console.log("Ensuring student exists in database...");
                await ensureStudentExists();
                console.log("Student record confirmed.");
            }

            const requestBody = {   
                studentID: user.id,
                classCode: classCode,
            } 
            const classID = await postJoinClass(requestBody);    
            console.log("Class ID:", classID); 
            await fetchClasses(user.id, user.role);
            await setCurrentClass(classID);
            console.log("Class joined successfully:", classCode); 
            navigate('/unitpage'); 
       } 
       catch (error) {  
            console.error("Detailed error joining class:", {
                error: error,
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                studentID: user.id,
                classCode: classCode
            }); 
            
            // Show user-friendly error message
            if (error.response?.status === 404) {
                if (error.response.data?.message?.includes('student')) {
                    alert("Your student account was not found. Please try creating a new account or contact support.");
                } else if (error.response.data?.message?.includes('class')) {
                    alert("Class code not found. Please check the class code and try again.");
                } else {
                    alert("Could not find the class or student record. Please contact your teacher.");
                }
            } else if (error.response?.status === 401) {
                alert("Authentication error. Please log in again.");
            } else {
                alert("Failed to join class. Please try again or contact your teacher.");
            }
       }
    };

    return(   
        <>   
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 bg-[length:200%_200%]" style={{animation: 'gradient-shift 15s ease-in-out infinite'}}>
            <NavBar title={"Join a Class"} /> 
            
            <div className="max-w-2xl mx-auto mt-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">

                    <form onSubmit={handleJoinClass} className="space-y-8">
                        {/* Class Code Input Section */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">
                                Join Class
                            </h3>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Enter the class code provided by your teacher to join the class.
                            </p>

                            <div className="space-y-2">
                                <label
                                    htmlFor="class-code-input"
                                    className="block text-sm font-semibold text-gray-900 dark:text-white"
                                >
                                    Class Code
                                </label>
                                <input
                                    id="class-code-input"
                                    type="text"
                                    placeholder="Enter Class Code"
                                    value={classCode}
                                    onChange={(e) => setClassCode(e.target.value)}
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
                                Join Class
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    ); 
}; 

export default JoinClassPage;