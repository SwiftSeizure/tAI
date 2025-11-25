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
import ClassStatisticsPage from './shared/pages/ClassStatisticsPage';
import NotFoundPage from './shared/pages/NotFoundPage';
import TeamPage from './shared/pages/TeamPage'; 
import MembersPage from './shared/pages/MembersPage';
import TutorialPage from './shared/pages/TutorialPage';

function App() {

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

                    {/* Class Statistics Routes */}
                    <Route path="/statistics" element={<ClassStatisticsPage />} /> 

  	  	  	  	  	{/* 404 - Catch all unmatched routes */}
  	  	  	  	  	<Route path="*" element={<NotFoundPage />} /> 


                    {/* Team Presence stuff */} 
                    {/* about page for wiki presence */} 
                    <Route path="/team" element={<TeamPage />} /> 

                    {/* members page  */}
                    <Route path="/members" element={<MembersPage />} /> 

                    {/* tutorial page */}
                    <Route path="/tutorial" element={<TutorialPage /> } />
	  	  	  	</Routes>
	  	  	</div>
	  	</BrowserRouter>
	);
}
export default App;