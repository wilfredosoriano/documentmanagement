import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [profile, setProfile] = useState('');

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };
  
  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`);
      setUser(null); 
      sessionStorage.removeItem('user');
    } catch (error) {
        console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if(storedUser){
      const user = JSON.parse(storedUser)
      setUser(user);
      axios.get(`${import.meta.env.VITE_API_URL}/users/info/${user.userId}`)
      .then(response => {
        const { profile } = response.data;
        setProfile(profile);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
    }
  },[])


  return (
    <UserContext.Provider value={{ user, login, logout, profile, setProfile }}>
      {children}
    </UserContext.Provider>
  )
}
