import React, { useEffect } from "react";
import CustomSideNav from "../components/SideNav";
import Header from "../components/Header";
import "../CSS/styles.css";
import CryptoJS from 'crypto-js';

const HomePage = ({ onLogout }) => {
  useEffect(() => {
    console.log("Użytkownik przekierowany do strony domowej.");

    // Zmiana koloru tła dla całej strony po załadowaniu komponentu HomePage
    document.body.style.backgroundColor = "#84A9BF";
    document.body.style.backgroundImage = "url('nowe_tło.jpg')";
    document.body.style.height = "auto";
    document.body.style.alignItems = "normal";

    // Warto również zresetować kolor tła po odmontowaniu komponentu
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.backgroundImage = "";
      document.body.style.height = "";
    };
  }, []);

  // Funkcja wywołująca zapytania do backendu
  const handleClick = async () => {
    console.log("siema");

    // Przykładowe dane logowania i rejestracji
    const username = 'dupa';
    const password = 'test';
    const email = 'new_user@example.com';

    // Haszowanie hasła za pomocą CryptoJS
    const hashedPassword = CryptoJS.SHA256(password).toString();

    try {
      // Przykładowe wywołanie testowego endpointu
      const testRes = await fetch('http://localhost:8000/', {
        method: 'GET'
      });
      const testData = await testRes.json();
      console.log('test response:', testData);

      const tokenString = localStorage.getItem("authToken");
      const tokenObj = JSON.parse(tokenString);

      console.log(tokenString ? JSON.parse(tokenString) : null);
      console.log(tokenObj.access_token);

      const meResponse = await fetch('http://localhost:8000/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenObj.access_token}`
        }
      });
      const meData = await meResponse.json();
      console.log('Me response:', meData);
    } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('Unexpected token')) {
        console.error('This is likely due to the server returning HTML instead of JSON.');
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <CustomSideNav onLogout={onLogout} />
      <Header />
      <h1>Home Page</h1>
      <button onClick={handleClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Kliknij mnie
      </button>
    </div>
  );
};

export default HomePage;
