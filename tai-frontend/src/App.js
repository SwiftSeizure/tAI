import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/Universal/LoginPage'; 
import TeacherStudentHomePage from './pages/Universal/TeacherStudentHomePage';

function App() { 



  return (
    <BrowserRouter>
      <div className="App">
        <Routes> 
           
            
          
          
          <Route path="/HomePage:user" element={<TeacherStudentHomePage /> } />  
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;