import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/Universal/LoginPage'; 
import TeacherStudentHomePage from './pages/Universal/TeacherStudentHomePage'; 
import TeacherStudentUnitPage from './pages/Universal/TeacherStudentUnitPage';
import TeacherStudentModulePage from './pages/Universal/TeacherStudentModulePage';

function App() { 



  return (
    <BrowserRouter>
      <div className="App">
        <Routes>  

          <Route path="/" element={<LoginPage />} />
           
          
          <Route path="/home" element={<TeacherStudentHomePage /> } />    
          <Route path="/unitpage" element={<TeacherStudentUnitPage /> } />     
          <Route path="/modulepage" element={ <TeacherStudentModulePage /> } />








          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;