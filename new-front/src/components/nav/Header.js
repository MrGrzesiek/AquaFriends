import React from "react";
import logoImage from '../../RES/logo.png';

function Header({ onLogout }) {
  return (
    <div style={styles.header}>
      <img src={logoImage} alt="Logo" style={styles.logo} />
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: "#2469A6",
    padding: "2px",
    color: "#fff",
    marginLeft: "64px",
    height: "64px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "Center",
  },
  logo: {
    height: "60px",
    marginRight:"64px"
  },
};

export default Header;
