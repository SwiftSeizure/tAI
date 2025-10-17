import api from "../../shared/services/axios"; 
import { createStudent } from "./create-student";
import { auth } from "../../auth/firebase";

export const getUserType = async () => {
    try {
        const response = await api.get(`/home/usertype`, { 
            headers: {
                'Content-Type': 'application/json',
            },
        }); 
        console.log("response", response);
        return response.data.user_type;
    } catch (error) {
        console.error('Error fetching user type:', error);
        
        // If user is not found (404), they are a new user - create account based on role preference
        if (error.response && error.response.status === 404) {
            console.log('User not found in database - creating new user account');
            
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    // Check for pending user info from signup process
                    const pendingRole = localStorage.getItem('pendingUserRole');
                    const pendingFullName = localStorage.getItem('pendingUserFullName');
                    const pendingUsername = localStorage.getItem('pendingUserUsername');
                    
                    // Use provided info or fallback to user data
                    const userName = pendingFullName || currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
                    const username = pendingUsername || currentUser.email?.split('@')[0] || `user_${Date.now()}`;
                    const userRole = pendingRole || 'student'; // Default to student if no role specified
                    
                    // Create account based on role
                    if (userRole === 'teacher') {
                        // Import createTeacher dynamically to avoid circular imports
                        const { createTeacher } = await import('./create-teacher');
                        await createTeacher(userName, username);
                        console.log('Teacher account created successfully');
                        
                        // Small delay to ensure database transaction is committed
                        await new Promise(resolve => setTimeout(resolve, 500));
                        return 'teacher';
                    } else {
                        // Create student account (default)
                        await createStudent(userName, username);
                        console.log('Student account created successfully');
                        
                        // Small delay to ensure database transaction is committed
                        await new Promise(resolve => setTimeout(resolve, 500));
                        return 'student';
                    }
                } else {
                    throw new Error('No authenticated user found');
                }
            } catch (createError) {
                console.error('Error creating user account:', createError);
                // If account creation fails, still return default role to allow login
                const defaultRole = localStorage.getItem('pendingUserRole') || 'student';
                return defaultRole;
            }
        }
        
        throw error;
    }
};
