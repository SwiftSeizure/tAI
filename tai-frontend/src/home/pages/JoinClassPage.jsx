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
    const [isLoading, setIsLoading] = useState(false);
    const [, { fetchClasses, setCurrentClass } ] = useClass();   
    const { user } = useCurrentUser(); 
    const navigate = useNavigate();  

    const handleJoinClass = async (e) => { 
        e.preventDefault(); 

        if (!user || !user.id) {
            alert("Please log in to join a class.");
            return;
        }

        if (!classCode.trim()) {
            alert("Please enter a class code.");
            return;
        }

        setIsLoading(true);

       try {

            // Ensure the student exists in the database before trying to enroll
            if (user.role === 'student') {
                try {
                    await ensureStudentExists();
                } catch (studentError) {
                    console.error("Error ensuring student exists:", studentError);
                    alert("There was an issue verifying your student account. Please try logging out and back in.");
                    return;
                }
            }

            const requestBody = {   
                studentID: user.id,
                classCode: classCode,
            } 
            const classID = await postJoinClass(requestBody);    
            
            // Fetch classes and set current class
            try {
                await fetchClasses(user.id, user.role);
                await setCurrentClass(classID);
            } catch (fetchError) {
                console.error("Error fetching classes after joining:", fetchError);
                // Don't fail the whole operation if class fetching fails
                // The user joined successfully, we can still navigate
            }
            
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
            } else if (error.message && error.message.includes('Network Error')) {
                alert("Network error. Please check your internet connection and try again.");
            } else {
                alert(`Failed to join class: ${error.message || 'Unknown error occurred'}. Please try again or contact your teacher.`);
            }
       } finally {
            setIsLoading(false);
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
                                disabled={isLoading}
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg 
                                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                         focus:ring-blue-500 transition-colors duration-200 shadow-sm
                                         hover:shadow-md w-full sm:w-auto disabled:opacity-50 
                                         disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                            >  
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Joining Class...
                                    </span>
                                ) : (
                                    'Join Class'
                                )}
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