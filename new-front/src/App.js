import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/user/HomePage";
import AdminPage from "./pages/admin/AdminPage";
import { checkBackend } from "./components/auth/SessionManager";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSatelliteDish } from '@fortawesome/free-solid-svg-icons';
import AquaMonitor from "./pages/user/AquaMonitor/AquaMonitor";
import AquariumsList from "./pages/user/AquariumsList";
import AquaAccount from "./pages/user/AquaAccount/AquaAccount";
import Layout from "./pages/Layout";
import AquaMaker from "./pages/user/AquaMaker/AquaMaker"
import fishImage from './RES/newfish3.jpg';

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
      const admin = localStorage.getItem("admin");
      setIsAdmin(admin === "true");
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
    localStorage.clear();
  };

  console.log("loggedIn:", loggedIn);
  console.log("isAdmin:", isAdmin);

  if (!backendAvailable) {
    document.body.style.backgroundImage = `url(${fishImage})`;
    document.body.style.height = "100vh";
    document.body.style.alignItems = "normal";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.flexDirection = "column";
    document.body.style.fontFamily = "Montserrat, sans-serif";
    document.body.style.margin = "0px 0 0px";
    return (
      <div style={{ textAlign: 'center', fontSize: "2vw", color: "white" }}>
        <FontAwesomeIcon icon={faSatelliteDish} size="2x" color="white" />
        <br />
        Brak połączenia z backendem
      </div>
    );
  } else {
    document.body.style.backgroundColor = "";
    document.body.style.backgroundImage = "";
    document.body.style.height = "";
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
                loggedIn ? (
                  <Layout onLogout={handleLogout} onSelect={setSelectedItem}>
                    <HomePage />
                  </Layout>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/admin"
              element={
                loggedIn ? (
                  <AdminPage onLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/aquariums"
              element={
                loggedIn ? (
                  <Layout onLogout={handleLogout} onSelect={setSelectedItem}>
                    <AquariumsList />
                  </Layout>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/aquamonitor/*"
              element={
                loggedIn ? (
                  <Layout onLogout={handleLogout} onSelect={setSelectedItem}>
                    <AquaMonitor />
                  </Layout>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
                path="/aquaaccount/*"
                element={
                  loggedIn ? (
                      <Layout onLogout={handleLogout} onSelect={setSelectedItem}>
                        <AquaAccount /></Layout>
                  ) : (
                      <Navigate to="/" />)} />
            <Route 
                path="/new_aquarium" 
                element={
                  loggedIn ? (
                      <Layout onLogout={handleLogout} onSelect={setSelectedItem}>
                        <AquaMaker /></Layout>
                  ) : (
                       <Navigate to="/" />)} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
