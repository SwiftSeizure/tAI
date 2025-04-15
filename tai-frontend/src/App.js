import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/Universal/LoginPage'; 
import TeacherStudentHomePage from './pages/Universal/TeacherStudentHomePage'; 
import TeacherStudentUnitPage from './pages/Universal/TeacherStudentUnitPage';

function App() { 



  return (
    <BrowserRouter>
      <div className="App">
        <Routes>  

          <Route path="/" element={<LoginPage />} />
           
          
          <Route path="/home" element={<TeacherStudentHomePage /> } />    
          <Route path="/unitpage" element={<TeacherStudentUnitPage /> } />   
          <Route path="/HomePage/student/:user" element={<TeacherStudentHomePage /> } />   

          <Route path="/UnitPage/:user/:class" element={<TeacherStudentUnitPage />} /> 


          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;