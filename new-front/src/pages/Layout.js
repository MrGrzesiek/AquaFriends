import React from 'react';
import CustomSideNav from "../components/nav/SideNav";
import Header from "../components/nav/Header";
import "../CSS/styles.css";
import "../CSS/Layout.css"
import {useNavigate} from "react-router-dom";

const Layout = ({ onLogout, onSelect, children }) => {
    const navigate = useNavigate();
    /*document.body.style.backgroundColor = "white";
    document.body.style.backgroundImage = "url(' ')";
    document.body.style.height = "auto";
    document.body.style.alignItems = "normal";*/

    /*return () => {
        document.body.style.backgroundColor = "";
        document.body.style.backgroundImage = "";
        document.body.style.height = "";
    };*/
    const handleSelect = (selected) => {
        onSelect(selected);
        switch (selected) {
            case 'home':
                navigate('/');
                break;
            case 'AquaMonitor':
                navigate('/aquamonitor');
                break;
            case 'AquaAccount':
                navigate('/account');
                break;
            case 'AquaMaker':
                navigate('/maker');
                break;
            case 'AquaLife':
                navigate('/life');
                break;
            case 'AquaDecorator':
                navigate('/decorator');
                break;
            case 'AquaHistory':
                navigate('/history');
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
