import React, { useState } from "react";
import "./CSS/styles.css";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import Logo from "./Logo";

export default function App() {
  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="App">
      <Logo />
      <div className={containerClass} id="container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Witaj ponownie</h1>
              <p>
                Kliknij przycisk zaloguj aby przejść do logowania
              </p>
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
              <p>Jeśli nie masz konta stwórz je kikając w przyscisk rejestracji</p>
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
      </div>
    </div>
  );
}
