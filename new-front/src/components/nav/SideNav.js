import React, { useState } from "react";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faHome, faPlus, faFish, faPalette, faBinoculars, faClockRotateLeft, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import AquariumsList from "../../pages/user/AquariumsList";
library.add(faUser, faHome, faPlus, faFish, faPalette, faBinoculars , faClockRotateLeft, faArrowRightFromBracket);

function CustomSideNav({ onLogout, onSelect  }) {
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
    <div> 
      {/* SideNav */}
      <SideNav style={styles}
        onSelect={(selected) => {
          console.log("Selected: " + selected);
          if (selected === 'Logout') {
            onLogout();
          } else if (['AquaMonitor', 'AquaDecorator', 'AquaHistory', 'AquaAccount', 'AquaMaker'].includes(selected)) {
            console.log("CustomSideNav: selected: " + selected);
            onSelect(selected);
          } else {
            onSelect('home');
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
          <NavItem eventKey="AquaAccount">
            <NavIcon>
              <FontAwesomeIcon icon={faUser} style={iconStyles} />
            </NavIcon>
            <NavText>AquaAccount</NavText>
          </NavItem>
          <NavItem eventKey="AquaMaker">
            <NavIcon>
              <FontAwesomeIcon icon={faPlus} style={iconStyles} />
            </NavIcon>
            <NavText>AquaMaker</NavText>
          </NavItem>
          <NavItem eventKey="AquaLife">
            <NavIcon>
              <FontAwesomeIcon icon={faFish} style={iconStyles} />
            </NavIcon>
            <NavText>AquaLife</NavText>
          </NavItem>
          <NavItem eventKey="AquaDecorator">
            <NavIcon>
              <FontAwesomeIcon icon={faPalette} style={iconStyles} />
            </NavIcon>
            <NavText>AquaDecorator</NavText>
          </NavItem>
          <NavItem eventKey="AquaMonitor">
            <NavIcon>
              <FontAwesomeIcon icon={faBinoculars} style={iconStyles} />
            </NavIcon>
            <NavText>AquaMonitor</NavText>
          </NavItem>
          <NavItem eventKey="AquaHistory">
            <NavIcon>
              <FontAwesomeIcon icon={faClockRotateLeft} style={iconStyles} />
            </NavIcon>
            <NavText>AquaHistory</NavText>
          </NavItem>
          <NavItem eventKey="Logout">
            <NavIcon>
              <FontAwesomeIcon icon={faArrowRightFromBracket} style={iconStyles} />
            </NavIcon>
            <NavText>Wyloguj</NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    </div>
  );
}

export default CustomSideNav;
