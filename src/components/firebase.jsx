
import React, { useContext, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { AuthContext } from '../Context/AuthContext';
import useAxios from './useAxios';

const firebaseConfig = {
    apiKey: "AIzaSyDnNFszqf2n5P8ekFhbIcR_HDufhtHXzdk",
    authDomain: "restaurant-management-sy-4c2c8.firebaseapp.com",
    projectId: "restaurant-management-sy-4c2c8",
    storageBucket: "restaurant-management-sy-4c2c8.appspot.com",
    messagingSenderId: "736422553584",
    appId: "1:736422553584:web:121ecad67feef01837df35",
    measurementId: "G-HLBB29FJ4C"
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
                    vapidKey: "BNK4QUakbgI1EuK6GXomrSYe8bWdoYNhDFH0mHtM5oRSL2prjMV8K8sUDWZjgxv_-WSm-Y67Q7bVdlusq13Lizg"
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

