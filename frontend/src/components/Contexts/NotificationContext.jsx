import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notificationCount, setNotificationCount] = useState('');
    return (
        <NotificationContext.Provider value={{ notificationCount, setNotificationCount }}>
            {children}
        </NotificationContext.Provider>
    )
};