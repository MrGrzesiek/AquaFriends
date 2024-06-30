import React from 'react';
import CustomSideNav from "../components/nav/SideNav";
import Header from "../components/nav/Header";
import "../CSS/styles.css";
import "../CSS/Layout.css"
import {useNavigate} from "react-router-dom";

const Layout = ({ onLogout, onSelect, children }) => {
    const navigate = useNavigate();

    const handleSelect = (selected) => {
        onSelect(selected);
        switch (selected) {
            case 'home':
                navigate('/');
                break;
            case 'AquaMonitor':
                navigate('/aquariums', { state: { origin: 'AquaMonitor' } });
                break;
            case 'Logout':
                onLogout();
                navigate('/login');
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
