import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/user/HomePage";
import AdminPage from "./pages/admin/AdminPage";
import {checkBackend} from "./components/auth/SessionManager"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSatelliteDish } from '@fortawesome/free-solid-svg-icons';
import AquaMonitor from "./pages/user/AquaMonitor";
import AquariumsList from "./pages/user/AquariumsList";
import Layout from "./pages/Layout";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [selectedItem, setSelectedItem] = useState('home');

  useEffect(() => {
    const checkConnection = async () => {
      const isAvailable = await checkBackend();
      setBackendAvailable(isAvailable);
    };

    checkConnection();
    const intervalId = setInterval(checkConnection, 10000);
    const token = localStorage.getItem("authToken");
    if (token) {
      setLoggedIn(true);
    }
    return () => clearInterval(intervalId);
  }, []);

  const handleLogin = async () => {
    console.log("zalogowany");
    setLoggedIn(true);
    console.log("biore token");
    const tokenString = localStorage.getItem("authToken");
    const tokenObj = JSON.parse(tokenString);
    console.log("pokazuje token");
    console.log(tokenObj);
    const admin = localStorage.getItem("admin");
    console.log(admin);
    if (admin) {
      console.log("ustawiam admina");
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

  if (!backendAvailable) {
    return (
      <div style={{ textAlign: 'center',
                    fontSize: "2vw",
                    color: "white"}}>
        <FontAwesomeIcon icon={faSatelliteDish} size="2x" color="white" />
        <br />
        Brak połączenia z backendem
      </div>
    );
  }
  else{
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/login" />} />
            <Route path="/"                        element={loggedIn ? <Layout onLogout={handleLogout} onSelect={setSelectedItem}><HomePage /></Layout> : <Navigate to="/login" />} />
            <Route path="/aquariums"       element={loggedIn ? <Layout onLogout={handleLogout} onSelect={setSelectedItem}><AquariumsList /></Layout> : <Navigate to="/login" />} />
            <Route path="/aquamonitor/*" element={loggedIn ? <Layout onLogout={handleLogout} onSelect={setSelectedItem}><AquaMonitor /></Layout> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    );
  }
  
}

export default App;
