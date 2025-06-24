import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/Universal/LoginPage'; 
import TeacherStudentHomePage from './pages/Universal/TeacherStudentHomePage'; 
import TeacherStudentUnitPage from './pages/Universal/TeacherStudentUnitPage';
import TeacherStudentModulePage from './pages/Universal/TeacherStudentModulePage'; 
import CreateClassPage from './pages/Teacher/CreateClassPage'; 
import JoinClassPage from './pages/Student/JoinClassPage';
import CreateUnitPage from './pages/Teacher/CreateUnitPage';

function App() { 



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