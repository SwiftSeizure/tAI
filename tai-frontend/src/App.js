import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/Universal/LoginPage'; 
import TeacherStudentHomePage from './pages/Universal/TeacherStudentHomePage';

function App() { 



  return (
    <BrowserRouter>
      <div className="App">
        <Routes>  

          <Route path="/" element={<LoginPage />} />
           
          
          <Route path="/HomePage/teacher/:user" element={<TeacherStudentHomePage /> } />   
          <Route path="/HomePage/student/:user" element={<TeacherStudentHomePage /> } />  


          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;