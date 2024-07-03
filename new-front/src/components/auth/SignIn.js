import React, { useState } from "react";
import CryptoJS from 'crypto-js';
import { handleResponse } from './SessionManager';

function SignInForm({ onLogin }) {
  const [state, setState] = useState({
    username: "",
    password: "",
    error: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = evt => {
    const { name, value } = evt.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const handleOnSubmit = async evt => {
    evt.preventDefault();

    const { username, password } = state;

    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Pole nazwa jest wymagane";
    }
    if (!password.trim()) {
      newErrors.password = "Pole hasło jest wymagane";
    }

    if (Object.keys(newErrors).length > 0) {
      setState(prevState => ({
        ...prevState,
        error: "Proszę wprowadzić nazwę użytkownika i hasło."
      }));
      setErrors(newErrors);
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
        throw new Error("Nieprawidłowa nazwa użytkownika lub hasło.");
      }

      await handleResponse(response, username);

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
          style={{ border: errors.username ? "2px solid red" : "" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          value={state.password}
          onChange={handleChange}
          style={{ border: errors.password ? "2px solid red" : "" }}
        />
        <button type="submit">Zaloguj</button>
        {state.error && <p className="error-message">{state.error}</p>}
      </form>
    </div>
  );
}

export default SignInForm;
