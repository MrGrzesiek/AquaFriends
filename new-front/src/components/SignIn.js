import React, { useState } from "react";
import CryptoJS from 'crypto-js';
import {handleResponse} from './SessionManager';

function SignInForm({ onLogin }) {
  const [state, setState] = useState({
    email: "",
    password: "",
    error: ""
  });

  const handleChange = evt => {
    const { name, value } = evt.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOnSubmit = async evt => {
    evt.preventDefault();

    const { username, password } = state;

    if (!username || !password) {
      setState(prevState => ({
        ...prevState,
        error: "Proszę wprowadzić adres e-mail i hasło."
      }));
      return;
    }

    try {
      const formData = new FormData();
      const hashedPassword = CryptoJS.SHA256(password).toString();
      formData.append("username", username);
      formData.append("password", hashedPassword);

      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Nieprawidłowy adres e-mail lub hasło.");
      }

      await handleResponse(response);

      onLogin(true);

      setState({
        username: "",
        password: "",
        error: ""
      });

    } catch (err) {
      setState(prevState => ({
        ...prevState,
        error: err.message
      }));
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Logowanie</h1>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          name="username"
          value={state.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          value={state.password}
          onChange={handleChange}
        />
        <button type="submit">Zaloguj</button>
        {state.error && <p className="error-message">{state.error}</p>}
      </form>
    </div>
  );
}

export default SignInForm;
