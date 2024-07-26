import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import About from './components/About';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;