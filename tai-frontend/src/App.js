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
  	const [{ user }, { setUser }] = useUser();
  	const [isAuthChecking, setIsAuthChecking] = useState(true);

  	useEffect(() => {
  	  	// Listen for auth state changes
  	  	const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  	  		try {
  	  			if (firebaseUser) {
  	  				// User is signed in - restore session
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
  	  			} else {
  	  				// User is signed out
  	  				await setUser(null);
  	  			}
  	  		} catch (error) {
  	  			console.error('Error restoring user session:', error);
  	  			// If there's an error, clear the user state
  	  			await setUser(null);
  	  		} finally {
  	  			// Always set auth checking to false, even if there's an error
  	  	  	  	setIsAuthChecking(false);
  	  	  	}
  	  	});

  	  	// Cleanup subscription on unmount
  	  	return () => unsubscribe();
  	}, [setUser]);

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

  	  	    	  	<Route path="/home" element={<TeacherStudentHomePage /> } />    
  	  	    	  	<Route path="/unitpage" element={<TeacherStudentUnitPage /> } />     
  	  	    	  	<Route path="/modulepage" element={ <TeacherStudentModulePage /> } /> 

  	  	    	  	{/* Class Specific Routes */}
  	  	    	  	<Route path="/createclass" element={ <CreateClassPage />} /> 
  	  	    	  	<Route path="/joinclass" element={ <JoinClassPage /> } /> 

  	  	    	  	{/* Unit Specific Routes */}
  	  	    	  	<Route path="/createunit" element={ <CreateUnitPage /> } />
  	  	    	</Routes>
  	  	  </div>
  	  	</BrowserRouter>
  	);
}

export default App;