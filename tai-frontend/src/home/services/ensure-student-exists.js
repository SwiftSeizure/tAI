import api from "../../shared/services/axios";
import { createStudent } from "../../login/services/create-student";
import { auth } from "../../auth/firebase";

export const ensureStudentExists = async () => {
    try {
        // Try to get the current student record
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No authenticated user found');
        }

        const response = await api.get(`/student/${currentUser.uid}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        
        // If student doesn't exist (404), create them
        if (error.response && error.response.status === 404) {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Student';
                const username = currentUser.email?.split('@')[0] || `student_${Date.now()}`;
                
                try {
                    const newStudent = await createStudent(displayName, username);
                    
                    // Wait a moment for database consistency
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    return newStudent;
                } catch (createError) {
                    console.error('Error creating student:', createError);
                    throw createError;
                }
            }
        }
        
        throw error;
    }
};