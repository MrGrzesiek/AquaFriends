import React from "react";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHome,
  faFish,
  faArrowRightFromBracket,
  faMicrochip,
  faExclamation
} from "@fortawesome/free-solid-svg-icons";

function AdminSideNav({ onLogout, onSelect }) {
  const styles = {
    background: "#2469A6",
    position: "fixed",
    top: 0,
    height: "100vh",
    zIndex: 1000,
    color: "#fff",
  };

  const iconStyles = {
    color: "#fff",
    fontSize: "1.5rem"
  };

  return (
    <SideNav
      style={styles}
      onSelect={(selected) => {
        onSelect(selected);
        if (selected === "Logout") {
          onLogout();
        }
      }}
    >
      <SideNav.Toggle />
      <SideNav.Nav defaultSelected="home">
        <NavItem eventKey="home">
          <NavIcon>
            <FontAwesomeIcon icon={faHome} style={iconStyles} />
          </NavIcon>
          <NavText>Home</NavText>
        </NavItem>
        <NavItem eventKey="Species">
          <NavIcon>
            <FontAwesomeIcon icon={faFish} style={iconStyles} />
          </NavIcon>
          <NavText>Kreator gatunków</NavText>
        </NavItem>
        <NavItem eventKey="AquaDevice">
          <NavIcon>
            <FontAwesomeIcon icon={faMicrochip} style={iconStyles} />
          </NavIcon>
          <NavText>Kreator urządzeń</NavText>
        </NavItem>
        <NavItem eventKey="Warning">
          <NavIcon>
            <FontAwesomeIcon icon={faExclamation} style={iconStyles} />
          </NavIcon>
          <NavText>Kreator ostrzeżeń</NavText>
        </NavItem>
        <NavItem eventKey="Logout">
          <NavIcon>
            <FontAwesomeIcon icon={faArrowRightFromBracket} style={iconStyles} />
          </NavIcon>
          <NavText>Wyloguj</NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
}

export default AdminSideNav;
