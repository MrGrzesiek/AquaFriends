import React, { useEffect, useState } from "react";
import CustomSideNav from "../../components/nav/SideNav";
import Header from "../../components/nav/Header";
import "../../CSS/styles.css";
import AquariumsList from "./AquaMonitor";

const HomePage = ({ onLogout }) => {
  const [selectedItem, setSelectedItem] = useState('home');
  useEffect(() => {
    console.log("Użytkownik przekierowany do strony domowej.");

    // Zmiana koloru tła dla całej strony po załadowaniu komponentu HomePage
    document.body.style.backgroundColor = "white";
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

      // Wywołanie nowego endpointu species
      const speciesResponse = await fetch('http://localhost:8000/fishes/species', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenObj.access_token}`
        }
      });
      const speciesData = await speciesResponse.json();
      console.log('Species response:', speciesData);
    } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('Unexpected token')) {
        console.error('This is likely due to the server returning HTML instead of JSON.');
      }
    }
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'home':
        return (
            <>
              <Header />
              <h1>Home Page</h1>
              <button onClick={handleClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
                Kliknij mnie
              </button>
            </>
        );
      case 'AquaMonitor':
        return <AquariumsList />;
      default:
        return null;
    }
  };

  return (
      <div>
        <CustomSideNav onLogout={onLogout} onSelect={setSelectedItem} />
        {renderContent()}
      </div>
  );
};

export default HomePage;
