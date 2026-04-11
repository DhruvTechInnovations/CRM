import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const timerRef = useRef(null);

    const showNotification = useCallback((message, type = 'info', duration = 3000) => {
        // Clear existing timer if any
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setNotification({ message, type });

        timerRef.current = setTimeout(() => {
            setNotification(null);
            timerRef.current = null;
        }, duration);
    }, []);

    const hideNotification = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setNotification(null);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification, notification }}>
            {children}
        </NotificationContext.Provider>
    );
};
