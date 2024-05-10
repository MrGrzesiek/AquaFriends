import React, { useEffect } from "react";
import CustomSideNav from "../components/SideNav";
import Header from "../components/Header";
import "../CSS/styles.css";

const HomePage = ({ onLogout }) => {
  useEffect(() => {
    console.log("Użytkownik przekierowany do strony domowej.");

    // Zmiana koloru tła dla całej strony po załadowaniu komponentu HomePage
    document.body.style.backgroundColor = "#84A9BF";
    document.body.style.backgroundImage = "url('nowe_tło.jpg')";
    document.body.style.height  = "auto";
    document.body.style.alignItems  = "normal";

    // Warto również zresetować kolor tła po odmontowaniu komponentu
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.backgroundImage  = "";
      document.body.style.height  = "";
    };
  }, []); 

  return (
    <div>
      <CustomSideNav onLogout={onLogout}/>
      <Header />
      <h1>Home Page</h1>
    </div>
  );
};

export default HomePage;
