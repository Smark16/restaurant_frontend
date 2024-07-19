import React, { useEffect, useState } from 'react';
import axios from 'axios';

const orderUrl = 'http://127.0.0.1:8000/restaurant/orders';
const reservationUrl = 'http://127.0.0.1:8000/restaurant/reservation';
const userUrl = 'http://127.0.0.1:8000/restaurant/users';
const foodUrl = 'http://127.0.0.1:8000/restaurant/food_items';
const latestOrderUrl = 'http://127.0.0.1:8000/restaurant/latest_orders';
const orderItemsUrl = 'http://127.0.0.1:8000/restaurant/order_items';

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
