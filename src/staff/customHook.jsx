import React, { useEffect, useState } from 'react';
import axios from 'axios';

const orderUrl = 'http://127.0.0.1:8000/orders/user_orders';
const reservationUrl = 'http://127.0.0.1:8000/reservations/all_resrvations';
const foodUrl = 'https://restaurant-backend5.onrender.com/restaurant/food_items';
const latestOrderUrl = 'https://restaurant-backend5.onrender.com/restaurant/latest_orders';


function useHook() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [food, setFood] = useState([]);
    const [latest, setLatest] = useState([]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios(orderUrl);
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await axios(reservationUrl);
            setReservations(response.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchFood = async () => {
        try {
            setLoading(true);
            const response = await axios(foodUrl);
            setFood(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchLatest = async () => {
        try {
            const response = await axios(latestOrderUrl);
            setLatest(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchReservations();
        fetchFood();
        fetchLatest();
    }, []);

    return {
        orders, loading, reservations, food, latest
    };
}

export default useHook;
