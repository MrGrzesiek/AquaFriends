import React, { useState } from 'react';
import './Registration.css'; // Zaimportowanie pliku CSS

const Registration = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Tutaj można dodać logikę rejestracji, np. wysłanie danych do serwera
    // Tutaj można użyć fetch lub axios, aby wysłać dane rejestracji do serwera
    // Po zarejestrowaniu użytkownika, można zamknąć formularz
    onClose();
  };

  return (
    <div className="registration-container"> {/* Dodanie klasy dla kontenera rejestracji */}
      <h2>Rejestracja</h2>
      <input
        type="text"
        placeholder="Nazwa użytkownika"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="registration-input" // Dodanie klasy dla inputu
      />
      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="registration-input" // Dodanie klasy dla inputu
      />
      <button onClick={handleRegister} className="registration-button">Zarejestruj</button> {/* Dodanie klasy dla przycisku */}
      <button onClick={onClose} className="close-button">X</button> {/* Dodanie klasy dla przycisku zamknięcia */}
    </div>
  );
};

export default Registration;
