import api from "../../shared/services/axios"; 
import { createStudent } from "./create-student";
import { auth } from "../../auth/firebase";

// Helper function to verify user was created successfully AND can fetch classes
const verifyUserCreatedAndReady = async (userId, role) => {
    const maxRetries = 15; // Increased retries
    const retryDelay = 500; // Increased delay to 500ms
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            // Try to fetch the user's classes to verify they exist AND are ready
            const url = `/home/${role}/${userId}`;
            const response = await api.get(url);
            console.log(`User ${userId} verified as ${role} and ready after ${i + 1} attempts`);
            
            // Additional check: ensure the response is valid
            if (response.data) {
                return; // Success - user exists and is ready
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // User not found yet, wait and retry
                if (i < maxRetries - 1) {
                    console.log(`Waiting for user to be ready... attempt ${i + 1}/${maxRetries}`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    continue;
                }
            } else if (error.response && error.response.status !== 404) {
                // Some other error occurred, but user might exist
                console.log(`Non-404 error on attempt ${i + 1}, retrying...`, error.response.status);
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    continue;
                }
            }
            // If it's not a 404 or we've exhausted retries, throw the error
            if (i === maxRetries - 1) {
                throw error;
            }
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
                    
                    console.log(`Creating ${userRole} account for ${userName}`);
                    
                    // Create account based on role
                    if (userRole === 'teacher') {
                        // Import createTeacher dynamically to avoid circular imports
                        const { createTeacher } = await import('./create-teacher');
                        await createTeacher(userName, username);
                        console.log('Teacher account created successfully');
                        
                        // Verify the user was created successfully AND is ready
                        await verifyUserCreatedAndReady(currentUser.uid, 'teacher');
                        return 'teacher';
                    } else {
                        // Create student account (default)
                        await createStudent(userName, username);
                        console.log('Student account created successfully');
                        
                        // Verify the user was created successfully AND is ready
                        await verifyUserCreatedAndReady(currentUser.uid, 'student');
                        return 'student';
                    }
                } else {
                    throw new Error('No authenticated user found');
                }
            } catch (createError) {
                console.error('Error creating user account:', createError);
                // If account creation fails, throw error instead of returning default
                // This prevents navigation to /home with incomplete setup
                throw new Error(`Failed to create user account: ${createError.message}`);
            }
        }
        
        throw error;
    }
};