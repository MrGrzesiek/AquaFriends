import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  console.log("loggedIn:", loggedIn);
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/home" element={loggedIn ? <HomePage onLogout={handleLogout} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
