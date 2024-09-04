import React, { useState } from 'react';
import Header from './mobileComponents/Header';
import Navigation from './mobileComponents/Navigation';

const MobileTransactions = () => {

  const [menuOpen, setMenuOpen] = useState(() => {
    const savedMenuState = localStorage.getItem('menuOpen');
    return savedMenuState ? JSON.parse(savedMenuState) : false;
  });

    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

  return (
    <div>
        <Header toggleMenu={toggleMenu}/>
        <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
    </div>
  )
}

export default MobileTransactions;