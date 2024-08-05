import React, { useContext } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import useAxios from './useAxios';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';

const firebaseConfig = {
    apiKey: "AIzaSyDnNFszqf2n5P8ekFhbIcR_HDufhtHXzdk",
    authDomain: "restaurant-management-sy-4c2c8.firebaseapp.com",
    projectId: "restaurant-management-sy-4c2c8",
    storageBucket: "restaurant-management-sy-4c2c8.appspot.com",
    messagingSenderId: "736422553584",
    appId: "1:736422553584:web:121ecad67feef01837df35",
    measurementId: "G-HLBB29FJ4C"
};

export const tokenGeneration = ()=>{
    const { user } = useContext(AuthContext);  // Use useContext inside function
    const axiosInstance = useAxios();
    // Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

const generateToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const fcm_token = await getToken(messaging, {
                vapidKey: "BNK4QUakbgI1EuK6GXomrSYe8bWdoYNhDFH0mHtM5oRSL2prjMV8K8sUDWZjgxv_-WSm-Y67Q7bVdlusq13Lizg"
            });
            if (fcm_token && user) {
                await axios.patch(`http://127.0.0.1:8000/restaurant/fcm_token/${user.user_id}`, {fcm_token})
            } else {
                console.warn('No FCM token received.');
            }
        } else {
            console.warn('Notification permission not granted.');
        }
    } catch (error) {
        console.error('Error generating FCM token:', error);
    }
};


    return {
        messaging, generateToken
    }
}

