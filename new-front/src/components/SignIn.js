// SignInForm.js

import React, { useState } from "react";

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

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const { email, password } = state;

    // Sprawdź, czy pola e-mail i hasło są uzupełnione
    if (!email || !password) {
      setState(prevState => ({
        ...prevState,
        error: "Proszę wprowadzić adres e-mail i hasło."
      }));
      return;
    }

    // Symulacja weryfikacji danych logowania z danymi w bazie danych
    const validCredentials = {
      email: "example@example.com",
      password: "1"
    };

    if (email !== validCredentials.email || password !== validCredentials.password) {
      setState(prevState => ({
        ...prevState,
        error: "Nieprawidłowy adres e-mail lub hasło."
      }));
      return;
    }

    // Jeśli dane logowania są poprawne, wywołaj funkcję przekazaną jako props
    onLogin(true); // Wywołanie funkcji przekazanej jako props

    // Wyczyszczenie formularza
    setState({
      email: "",
      password: "",
      error: ""
    });
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Logowanie</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
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
