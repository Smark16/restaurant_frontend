
import React, { useContext, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { AuthContext } from '../Context/AuthContext';
import useAxios from './useAxios';

const firebaseConfig = {
    apiKey: "AIzaSyDJoXbSgkrFbrqBt4pG2O-3awVHHSga9Xo",
    authDomain: "restaurant-system-bad31.firebaseapp.com",
    projectId: "restaurant-system-bad31",
    storageBucket: "restaurant-system-bad31.firebasestorage.app",
    messagingSenderId: "654263112189",
    appId: "1:654263112189:web:3b3f6804951ecac1cb8994",
    measurementId: "G-H9PXT2D6NC"
};

export const tokenGeneration = () => {
    const { user } = useContext(AuthContext);
    const axiosInstance = useAxios();

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase Cloud Messaging and get a reference to the service
    const messaging = getMessaging(app);

    const generateToken = async () => {
        try {
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                const currentToken = await getToken(messaging, {
                    vapidKey: "BCDGsummNd6G91Ga0E2ParPsqA0vaXH0PU5Qn7Tgim34kFUNM50C6nzG0erK2M1HrLn05eHgiLZRueSO4HZO6Ww"
                });

                if (currentToken && user) {
                    await axiosInstance.patch(`https://restaurant-backend5.onrender.com/restaurant/fcm_token/${user?.user_id}`, { fcm_token: currentToken })
                        .then(response => {
                            console.log('FCM token saved successfully:', response);
                        })
                        .catch(error => {
                            console.error('Error saving FCM token:', error);
                        });
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                }
            } else {
                console.warn('Notification permission not granted.');
            }
        } catch (err) {
            // console.error('An error occurred while retrieving token:', err);
        }
    };

    // Call generateToken when the component mounts
    useEffect(() => {
        generateToken();
    }, []);

    // Call generateToken whenever the user changes (e.g., on login)
    useEffect(() => {
        if (user) {
            generateToken();
        }
    }, [user]); // Dependency on `user` ensures this runs when the user logs in

    return {
        messaging,
        generateToken
    };
};

export default tokenGeneration;

