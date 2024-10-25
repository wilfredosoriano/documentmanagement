import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../Interceptors/axiosInstance';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [profile, setProfile] = useState('');

  const storedUser = sessionStorage.getItem('user');
  const accessToken = sessionStorage.getItem('token');
  
  const logout = async () => {
    try {
      await axiosInstance.post(`${import.meta.env.VITE_API_URL}/users/logout`,{}, { headers: { 'Authorization': accessToken } });
      setUser(null); 
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } catch (error) {
        console.error('Error logging out:', error);
    }
  };

  useEffect(() => {

    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }

    if (storedUser) {

      const jsonStoredUser = JSON.parse(storedUser)
      setUser(jsonStoredUser);
      setProfile(jsonStoredUser.profile);

    } else {

      const fetchUserData = async () => {
        try {

          const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/info`, { token: accessToken, withCredentials: true } );
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
    }
  }, []);


  return (
    <UserContext.Provider value={{ user, logout, profile, setProfile, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
