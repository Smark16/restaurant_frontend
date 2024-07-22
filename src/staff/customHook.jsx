import React, { useEffect, useState } from 'react';
import axios from 'axios';

const orderUrl = 'https://restaurant-backend5.onrender.com/restaurant/orders';
const reservationUrl = 'https://restaurant-backend5.onrender.com/restaurant/reservation';
const userUrl = 'https://restaurant-backend5.onrender.com/restaurant/users';
const foodUrl = 'https://restaurant-backend5.onrender.com/restaurant/food_items';
const latestOrderUrl = 'https://restaurant-backend5.onrender.com/restaurant/latest_orders';
const orderItemsUrl = 'https://restaurant-backend5.onrender.com/restaurant/order_items';

function useHook() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [Revenue, setRevenue] = useState(0);
    const [reservations, setReservations] = useState([]);
    const [avg, setAvg] = useState(0);
    const [customer, setCustomer] = useState([]);
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

    const fetchOrderItems = async () => {
        try {
            const response = await axios(orderItemsUrl);
            const data = response.data;
            const amount = data.map(cash => cash.menu.reduce((total, item) => total + item.price, 0)).reduce((total, order) => total + order, 0).toFixed(2);
            setRevenue(amount);

            const avg_rev = amount / data.length;
            setAvg(avg_rev);
        } catch (err) {
            console.log('there was an error');
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

    const fetchCustomers = async () => {
        try {
            const response = await axios(userUrl);
            const data = response.data;
            const customers = data.filter(user => user.is_customer === true);
            setCustomer(customers);
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
        fetchCustomers();
        fetchFood();
        fetchLatest();
        fetchOrderItems();
    }, []);

    return {
        orders, loading, Revenue, reservations, avg, customer, food, latest
    };
}

export default useHook;
