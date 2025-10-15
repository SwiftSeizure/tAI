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
        
        // If user is not found (404), they are a new user - create student account
        if (error.response && error.response.status === 404) {
            console.log('User not found in database - creating new student account');
            
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    // Extract name from display name or email
                    const userName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Student';
                    const username = currentUser.email?.split('@')[0] || `student_${Date.now()}`;
                    
                    // Create the student account
                    await createStudent(userName, username);
                    console.log('Student account created successfully');
                    
                    // Small delay to ensure database transaction is committed
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    return 'student';
                } else {
                    throw new Error('No authenticated user found');
                }
            } catch (createError) {
                console.error('Error creating student account:', createError);
                // If student creation fails, still return 'student' to allow login
                // The user can be created later or through another process
                return 'student';
            }
        }
        
        throw error;
    }
};
