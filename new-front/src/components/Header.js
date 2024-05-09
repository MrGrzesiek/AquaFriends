import React from "react";
import logoImage from '../RES/logo.png';

function Header({ onLogout }) {
  return (
    <div style={styles.header}>
      <img src={logoImage} alt="Logo" style={styles.logo} />
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: "#db3d44",
    padding: "2px",
    color: "#fff",
    marginLeft: "64px",
    height: "64px",
  },
  logo: {
    height: "60px",
    marginRight:"64px"
  },
};

export default Header;
