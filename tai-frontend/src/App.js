import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/home" element={<HomePage />} /> 
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;