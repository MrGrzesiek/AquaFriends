import React from "react";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHome,
  faFish,
  faArrowRightFromBracket
} from "@fortawesome/free-solid-svg-icons";

function AdminSideNav({ onLogout, onSelect }) {
  const styles = {
    background: "#2469A6"
  };

  return (
    <div>
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
              <FontAwesomeIcon icon={faHome} />
            </NavIcon>
            <NavText>Home</NavText>
          </NavItem>
          <NavItem eventKey="Species">
            <NavIcon>
              <FontAwesomeIcon icon={faFish} />
            </NavIcon>
            <NavText>Kreator gatunków</NavText>
          </NavItem>
          <NavItem eventKey="AquaAccount">
            <NavIcon>
              <FontAwesomeIcon icon={faUser} />
            </NavIcon>
            <NavText>AquaAccount</NavText>
          </NavItem>
          <NavItem eventKey="Logout">
            <NavIcon>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </NavIcon>
            <NavText>Wyloguj</NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    </div>
  );
}

export default AdminSideNav;
