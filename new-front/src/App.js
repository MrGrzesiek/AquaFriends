import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Sprawdź, czy token jest w localStorage podczas ładowania komponentu
    const token = localStorage.getItem("authToken");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    
    console.log("zalogowany")
    setLoggedIn(true);
    console.log("biore token")
    const tokenString = localStorage.getItem("authToken");
    const tokenObj = JSON.parse(tokenString);
    console.log("pokazuje token")
    console.log(tokenObj)
    const admin = localStorage.getItem("admin");
    console.log(admin)
    if (admin) {
      console.log("ustawiam admina")
      setIsAdmin(true);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("admin");
  };

  console.log("loggedIn:", loggedIn);
  console.log("isAdmin:", isAdmin);
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              loggedIn ? (
                isAdmin ? <Navigate to="/admin" /> : <Navigate to="/home" />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/home" 
            element={
              loggedIn ? <HomePage onLogout={handleLogout} /> : <Navigate to="/" />
            } 
          />
          <Route 
            path="/admin" 
            element={
              loggedIn ? <AdminPage onLogout={handleLogout} /> : <Navigate to="/" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
