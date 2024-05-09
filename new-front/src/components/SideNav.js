import React from "react";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faHome, faPlus, faFish, faPalette, faBinoculars, faClockRotateLeft, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
library.add(faUser, faHome, faPlus, faFish, faPalette, faBinoculars , faClockRotateLeft, faArrowRightFromBracket);

function CustomSideNav({ onLogout }) {
  return (
    <div>
      {/* SideNav */}
      <SideNav
        onSelect={(selected) => {
          console.log(selected);
          if(selected === 'Logout') {
            // Call the onLogout function when 'Logout' is selected
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
          <NavItem eventKey="AquaAccount">
            <NavIcon>
              <FontAwesomeIcon icon={faUser} />
            </NavIcon>
            <NavText>AquaAccount</NavText>
          </NavItem>
          <NavItem eventKey="AquaMaker">
            <NavIcon>
              <FontAwesomeIcon icon={faPlus} />
            </NavIcon>
            <NavText>AquaMaker</NavText>
          </NavItem>
          <NavItem eventKey="AquaLife">
            <NavIcon>
              <FontAwesomeIcon icon={faFish} />
            </NavIcon>
            <NavText>AquaLife</NavText>
          </NavItem>
          <NavItem eventKey="AquaDecorator">
            <NavIcon>
              <FontAwesomeIcon icon={faPalette} />
            </NavIcon>
            <NavText>AquaDecorator</NavText>
          </NavItem>
          <NavItem eventKey="AquaMonitor">
            <NavIcon>
              <FontAwesomeIcon icon={faBinoculars} />
            </NavIcon>
            <NavText>AquaMonitor</NavText>
          </NavItem>
          <NavItem eventKey="AquaHistory">
            <NavIcon>
              <FontAwesomeIcon icon={faClockRotateLeft} />
            </NavIcon>
            <NavText>AquaHistory</NavText>
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

export default CustomSideNav;
