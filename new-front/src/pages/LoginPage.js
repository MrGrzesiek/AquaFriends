import React, { useState } from "react";
import "../CSS/styles.css";
import SignInForm from "../components/auth/SignIn";
import SignUpForm from "../components/auth/SignUp";
import Logo from "../components/nav/Logo";
import {useNavigate} from "react-router-dom";

export default function LoginPage({onLogin}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [type, setType] = useState("signIn");
  const navigate = useNavigate();

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
    }
  };

  const handleLogin = (isLoggedIn) => {
    if (isLoggedIn) {
      setLoggedIn(true);
      console.log("Użytkownik zalogowany.");
      onLogin();
      navigate('/');
    } else {
      console.log("Nieprawidłowe dane logowania.");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className="loginbackground">
      <Logo />
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm onLogin={handleLogin} /> {/* Przekazanie handleLogin jako props */}
        {!loggedIn && (
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1 className="h1login">Witaj ponownie</h1>
                <p>Kliknij przycisk zaloguj aby przejść do logowania</p>
                <button
                  className="ghost"
                  id="signIn"
                  onClick={() => handleOnClick("signIn")}
                >
                  Zaloguj
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1 className="h1login">Witaj</h1>
                <p>Jeśli nie masz konta stwórz je klikając w przycisk rejestracji</p>
                <button
                  className="ghost "
                  id="signUp"
                  onClick={() => handleOnClick("signUp")}
                >
                  Rejestracja
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
