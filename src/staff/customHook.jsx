import React, { useEffect, useState } from 'react';
import useAxios from '../components/useAxios';

const orderUrl = 'https://restaurant-backend5.onrender.com/orders/user_orders';
const reservationUrl = 'https://restaurant-backend5.onrender.com/reservations/all_resrvations';
const foodItemUrl = 'https://restaurant-backend5.onrender.com/restaurant/food_items'

function useHook() {
    const axiosInstance = useAxios()
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [latest, setLatest] = useState([]);
    const [foodItems, setFoodItems] = useState([])

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(orderUrl);
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(reservationUrl);
            setReservations(response.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };
    const fetchfoodItems = async () => {
        try {
            const response = await axiosInstance.get(foodItemUrl);
            setFoodItems(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchReservations();
        fetchfoodItems();
    }, []);

    return {
        orders, loading, reservations, latest, foodItems
    };
}

export default useHook;
