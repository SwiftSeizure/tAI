import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import LoginPage from '../src/login/pages/LoginPage'; 
import TeacherStudentHomePage from '../src/home/pages/TeacherStudentHomePage'; 
import TeacherStudentUnitPage from '../src/unit/pages/TeacherStudentUnitPage';
import TeacherStudentModulePage from '../src/module/pages/TeacherStudentModulePage'; 
import CreateClassPage from '../src/home/pages/CreateClassPage'; 
import JoinClassPage from '../src/home/pages/JoinClassPage'; 
import CreateUnitPage from '../src/unit/pages/CreateUnitPage'; 

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