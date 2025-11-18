import api from "../../shared/services/axios"; 
import { createStudent } from "./create-student";
import { auth } from "../../auth/firebase";

// Helper function to verify user was created successfully
const verifyUserCreated = async (userId, role) => {
    const maxRetries = 10;
    const retryDelay = 300; // 300ms between retries
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            // Try to fetch the user's classes to verify they exist
            const url = `/home/${role}/${userId}`;
            await api.get(url);
            console.log(`User ${userId} verified as ${role} after ${i + 1} attempts`);
            return; // Success - user exists
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // User not found yet, wait and retry
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    continue;
                }
            }
            // If it's not a 404 or we've exhausted retries, throw the error
            throw error;
        }
    }
    throw new Error(`Failed to verify user creation after ${maxRetries} attempts`);
};

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
                        
                        // Verify the user was created successfully
                        await verifyUserCreated(currentUser.uid, 'teacher');
                        return 'teacher';
                    } else {
                        // Create student account (default)
                        await createStudent(userName, username);
                        console.log('Student account created successfully');
                        
                        // Verify the user was created successfully
                        await verifyUserCreated(currentUser.uid, 'student');
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
