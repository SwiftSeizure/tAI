import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './auth/firebase';
import { useUser } from './store/user-store';
import { getUserType } from './login/services/get-user-type';
import LoginPage from './login/pages/LoginPage';
import TeacherStudentHomePage from './home/pages/TeacherStudentHomePage';
import TeacherStudentUnitPage from './unit/pages/TeacherStudentUnitPage';
import TeacherStudentModulePage from './module/pages/TeacherStudentModulePage';
import CreateClassPage from './home/pages/CreateClassPage';
import JoinClassPage from './home/pages/JoinClassPage';
import CreateUnitPage from './unit/pages/CreateUnitPage';

function App() {
    const [{ user }, { setUser, clearUser }] = useUser();
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Check if we already have user data in store (from localStorage)
                    const storedUser = JSON.parse(localStorage.getItem('tai_user_state') || '{}');
                    
                    // If we have stored user data with the same ID, use it immediately
                    if (storedUser.user?.id === firebaseUser.uid && storedUser.user?.role) {
                        await setUser({
                            id: firebaseUser.uid,
                            name: firebaseUser.displayName || storedUser.user.name,
                            role: storedUser.user.role,
                            email: firebaseUser.email,
                            token: await firebaseUser.getIdToken(),
                            profilePicture: firebaseUser.photoURL || storedUser.user.profilePicture
                        });
                        setIsAuthChecking(false);
                        
                        // Fetch fresh user type in background to update if needed
                        getUserType().then(userRole => {
                            if (userRole !== storedUser.user.role) {
                                setUser({
                                    id: firebaseUser.uid,
                                    name: firebaseUser.displayName,
                                    role: userRole,
                                    email: firebaseUser.email,
                                    token: firebaseUser.accessToken,
                                    profilePicture: firebaseUser.photoURL
                                });
                            }
                        }).catch(err => console.warn('Background user type fetch failed:', err));
                    } else {
                        // No stored data or different user - fetch fresh
                        const idToken = await firebaseUser.getIdToken();
                        const userRole = await getUserType();
                        
                        await setUser({
                            id: firebaseUser.uid,
                            name: firebaseUser.displayName,
                            role: userRole,
                            email: firebaseUser.email,
                            token: idToken,
                            profilePicture: firebaseUser.photoURL
                        });
                        setIsAuthChecking(false);
                    }
                } catch (error) {
                    console.error('Error restoring user session:', error);
                    // Don't clear user on error - they might still be authenticated
                    // Just use what we have from Firebase
                    const idToken = await firebaseUser.getIdToken().catch(() => null);
                    
                    // Try to use stored role as fallback
                    const storedUser = JSON.parse(localStorage.getItem('tai_user_state') || '{}');
                    const fallbackRole = storedUser.user?.role || 'student';
                    
                    await setUser({
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName,
                        role: fallbackRole,
                        email: firebaseUser.email,
                        token: idToken,
                        profilePicture: firebaseUser.photoURL
                    });
                    setIsAuthChecking(false);
                }
            } else {
                // User is signed out
                await clearUser();
                setIsAuthChecking(false);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [setUser, clearUser]);

    // Show loading state while checking auth
    if (isAuthChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {/* Universal Routes */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<TeacherStudentHomePage />} />
                    <Route path="/unitpage" element={<TeacherStudentUnitPage />} />
                    <Route path="/modulepage" element={<TeacherStudentModulePage />} />

                    {/* Class Specific Routes */}
                    <Route path="/createclass" element={<CreateClassPage />} />
                    <Route path="/joinclass" element={<JoinClassPage />} />

                    {/* Unit Specific Routes */}
                    <Route path="/createunit" element={<CreateUnitPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;