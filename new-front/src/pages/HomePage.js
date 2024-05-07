import React, { useEffect } from "react";

const HomePage = ({ onLogout }) => {
  useEffect(() => {
    console.log("Użytkownik przekierowany do strony domowej.");
  }, []); // Pusta tablica zależności oznacza, że useEffect będzie wywoływany tylko raz po zamontowaniu komponentu

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default HomePage;
