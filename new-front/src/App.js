import React, { useState } from 'react';
import './Login.css'; // Zaimportowanie pliku CSS
import Registration from './Registration'; // Import komponentu rejestracji

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLogin = () => {
    // Tutaj można dodać logikę logowania, np. wysłanie danych do serwera
    // Tutaj można użyć fetch lub axios, aby wysłać dane logowania do serwera
    // W tym przykładzie logujemy się zawsze, gdy dane są wprowadzone, niezależnie od ich poprawności
    setLoggedIn(true);
  };

  return (
    <div className="login-container"> {/* Dodanie klasy dla kontenera logowania */}
      {loggedIn ? (
        <div>
          <h2>Witaj, {username}!</h2>
          <button onClick={() => setLoggedIn(false)}>Wyloguj</button>
        </div>
      ) : (
        <div>
          <h2>Logowanie</h2>
          <input
            type="text"
            placeholder="Nazwa użytkownika"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input" // Dodanie klasy dla inputu
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input" // Dodanie klasy dla inputu
          />
          <button onClick={handleLogin} className="login-button">Zaloguj</button> {/* Dodanie klasy dla przycisku */}
          <p>Nie masz jeszcze konta? <button onClick={() => setShowRegistration(true)} className="register-link">Zarejestruj się</button></p>
        </div>
      )}
      {showRegistration && <Registration onClose={() => setShowRegistration(false)} />} {/* Warunek wyświetlania formularza rejestracji */}
    </div>
  );
};

export default Login;
