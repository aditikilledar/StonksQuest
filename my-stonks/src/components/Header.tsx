// Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure react-router-dom is installed

const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <button className="nes-btn is-normal" onClick={() => navigate("/StonkQuest")}> StonkQuest </button>
            <button className="nes-btn is-normal" onClick={() => navigate(-1)}>Back</button>
            {/* <h1 className="header-title">{title}</h1> */}
        </header>
    );
};

export default Header;
