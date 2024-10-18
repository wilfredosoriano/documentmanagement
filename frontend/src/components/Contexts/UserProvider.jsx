import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [profile, setProfile] = useState('');
  
  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`);
      setUser(null); 
    } catch (error) {
        console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/info`, { withCredentials: true });
        if (response.data) {
          const userData = {
            userId: response.data.userId,
            role: response.data.role,
            username: response.data.username,
          };
          setUser(userData);
          setProfile(response.data.profile);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };

    fetchUserData();
  }, []);


  return (
    <UserContext.Provider value={{ user, logout, profile, setProfile }}>
      {children}
    </UserContext.Provider>
  )
}
