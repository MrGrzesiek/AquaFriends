import React, { useState } from "react";
import "../CSS/styles.css";
import SignInForm from "../components/SignIn";
import SignUpForm from "../components/SignUp";
import Logo from "../components/Logo";

export default function LoginPage({onLogin}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [type, setType] = useState("signIn");

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
    <div className="App">
      <Logo />
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm onLogin={handleLogin} /> {/* Przekazanie handleLogin jako props */}
        {!loggedIn && (
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Witaj ponownie</h1>
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
                <h1>Witaj</h1>
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
