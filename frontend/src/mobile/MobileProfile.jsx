import React, { useState } from 'react';
import Header from './mobileComponents/Header';
import Navigation from './mobileComponents/Navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Profile from '@/components/Profile';


const MobileProfile = () => {

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

        <div className={`overflow-auto p-4 mt-[65px] max-sm:mb-16 ${menuOpen ? 'mr-[240px]' : 'mr-[96px] max-sm:mr-0'} `}>
            
            <Profile/>
        </div>
    </div>
  )
}

export default MobileProfile;