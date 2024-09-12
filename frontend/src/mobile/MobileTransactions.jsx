import React, { useEffect, useState } from 'react';
import Header from './mobileComponents/Header';
import Navigation from './mobileComponents/Navigation';
import DataTableTransaction from '@/components/DataTables/DataTableTransaction';
import axios from 'axios';

const MobileTransactions = () => {

  const [data, setData] = useState([]);

  const [menuOpen, setMenuOpen] = useState(() => {
    const savedMenuState = localStorage.getItem('menuOpen');
    return savedMenuState ? JSON.parse(savedMenuState) : false;
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions')
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      console.error('Error fetching transactions: ', error);
    });
  }, []);


  return (
    <div>
        <Header toggleMenu={toggleMenu}/>
        <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
        <div className={`overflow-auto p-4 mt-[65px] max-sm:mb-16 ${menuOpen ? 'mr-[240px]' : 'mr-[96px] max-sm:mr-0'} `}>
          <DataTableTransaction data={data}/>
        </div>
    </div>
  )
}

export default MobileTransactions;