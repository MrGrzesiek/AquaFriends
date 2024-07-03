import React, { useEffect, useState } from "react";
import CustomSideNav from "../../components/nav/SideNav";
import Header from "../../components/nav/Header";
import "../../CSS/styles.css";
import AquariumsList from "./AquariumsList";
import AquaMonitor from "./AquaMonitor/AquaMonitor";
import {useNavigate} from "react-router-dom";

const HomePage = ({ onLogout }) => {
  const [selectedItem, setSelectedItem] = useState('home');
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Użytkownik przekierowany do strony domowej.");

    // Zmiana koloru tła dla całej strony po załadowaniu komponentu HomePage
    document.body.style.backgroundColor = "white";
    document.body.style.backgroundImage = "url(' ')";
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
  };

  const renderContent = () => {
        return (
            <>
              <h1>Home Page</h1>
              <button onClick={handleClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
                Kliknij mnie
              </button>
            </>
        );
  };

  return (
      <div>
        {renderContent()}
      </div>
  );
};

export default HomePage;
