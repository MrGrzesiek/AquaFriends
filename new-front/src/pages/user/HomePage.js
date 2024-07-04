import React, { useEffect, useState } from "react";
import CustomSideNav from "../../components/nav/SideNav";
import Header from "../../components/nav/Header";
import "../../CSS/styles.css";
import AquariumsList from "./AquariumsList";
import AquaMonitor from "./AquaMonitor/AquaMonitor";
import {useNavigate} from "react-router-dom";

const HomePage = ({ onLogout }) => {
  const [selectedItem, setSelectedItem] = useState('home');
  const [username, setUsername] = useState(null);
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

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || 'Gość');
  }, []);

  const renderContent = () => {
        return (
            <>
              <h1>Witaj, {username}!</h1>
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
