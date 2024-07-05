import React from 'react';
import CustomSideNav from "../components/nav/SideNav";
import Header from "../components/nav/Header";
import "../CSS/styles.css";
import "../CSS/Layout.css"
import {useNavigate} from "react-router-dom";

const Layout = ({ onLogout, onSelect, children }) => {
    const navigate = useNavigate();

    const handleSelect = (selected) => {
        const username = localStorage.getItem('username');
        console.log("HandleSelect: selected: " + selected);
        onSelect(selected);
        switch (selected) {
            case 'home':
                navigate('/');
                break;
            case 'AquaMonitor':
                navigate('/aquariums', { state: { origin: 'AquaMonitor', refresh: true } });
                break;
            case 'Logout':
                onLogout();
                navigate('/');
                break;
            case 'AquaAccount':
                navigate('/aquaaccount/' + username, { state: { origin: 'AquaAccount' } });
                break;
            case 'AquaMaker':
                navigate('/new_aquarium', { state: { origin: 'AquaMaker' } })
                break;
            case 'AquaHistory':
                navigate('/aquariums', { state: { origin: 'AquaHistory', refresh: true } })
                break;
            default:
                navigate('/');
        }
    }

    return (
            <div className="layout">
                <Header />
                    <div className="main-content">
                        <CustomSideNav onLogout={onLogout} onSelect={handleSelect} />
                        <div className="content">
                            {children}
                        </div>
                    </div>
            </div>
    );
};

export default Layout;
