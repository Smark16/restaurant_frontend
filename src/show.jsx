// App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect } from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css';
import Bar from './components/Navbar';
import Home from './components/Home';
import Login from './components/login';
import Logout from './staff/logout';
import Signup from './components/signup';
import PrivateRoute from './components/privateRoute';
import Staff from './staff/Staff';
import Customer from './customer/Customer';
import Sidebar from './staff/Sidebar';
import Menu from './staff/Menu';
import Orders from './staff/Orders';
import Reservation from './staff/Reservation';
import Customers from './staff/Customers';
import StaffProfile from './staff/Profile';
import AddItem from './staff/addItem';
import SingleItem from './staff/singleItem';
import Custbar from './customer/Custbar';
import Order from './customer/Order';
import Profile from './customer/Profile';
import Reservations from './customer/Reservation';
import Payment from './customer/payment';
import MenuDisplay from './customer/Menu';
import UpdateItem from './staff/update';
import ResetPassword from './staff/resetPassword';
import ForgotPassword from './components/forgotPassword';
import ChangePassword from './components/ChangePassword';
import SingleMenu from './customer/singleItem';
import Cart from './customer/cart';
import About from './LandingPage/about';
import Booking from './LandingPage/booking';
import Contact from './LandingPage/contact';
import Testimonial from './LandingPage/testimonial';
import Service from './LandingPage/service';
import Team from './LandingPage/team';
import Menus from './LandingPage/menu';
import Index from './LandingPage';
import Receipt from './customer/receipt';
import { AuthContext } from './Context/AuthContext';
import Notify from './customer/Notify';
import Checkout from './customer/checkout';
import { tokenGeneration } from './components/firebase';
import { onMessage } from 'firebase/messaging';
import toast, { Toaster } from 'react-hot-toast';


function Show() {
  const {display, setNotifyAll, setOrderNotify} = useContext(AuthContext)
  const {messaging, generateToken} = tokenGeneration()
  useEffect(() => {
    generateToken();

    onMessage(messaging, (payload) => {
      console.log('Received payload:', payload);

      if (payload.notification && payload.notification.body) {
        toast(payload.notification.body);
        setNotifyAll((prev) => [...prev, payload.notification.body]);
        setOrderNotify((prev) => [...prev, payload.notification.body])
      } else {
        console.error('Notification payload is incorrect or missing');
      }
    });
  }, [messaging, generateToken]);
  return (
    <>
     <Toaster position='top-right'/> 
          <Bar />
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/changePassword' element={<ChangePassword/>}/>
            <Route path='/index' element={<Index/>}></Route>
            <Route path='/about' element={<About/>}></Route>
            <Route path='/booking' element={<Booking/>}></Route>
            <Route path='/contact' element={<Contact/>}></Route>
            <Route path='/menus' element={<Menus/>}></Route>
            <Route path='/team' element={<Team/>}></Route>
            <Route path='/testimonial' element={<Testimonial/>}></Route>
            <Route path='/service' element={<Service/>}></Route>



            {/* Staff Routes */}
            <Route
              path='/staff/dashboard/*'
              element={
                <PrivateRoute>
                  <div className="sidewidth">
                    <div className={`sides ${display ? 'show' : ''}`}>
                      <Sidebar />
                    </div>
                    <div className="props p-3">
                      <Routes>
                        <Route path='menu' element={<Menu />} />
                        <Route path='orders' element={<Orders />} />
                        <Route path='reservations' element={<Reservation />} />
                        <Route path='/' element={<Staff />} />
                        <Route path='addItem' element={<AddItem/>}/>
                        <Route path='customers' element={<Customers />} />
                        <Route path='profile' element={<StaffProfile/>}/>
                        <Route path='items/:id' element={<SingleItem/>}/>
                        <Route path='update/:id' element={<UpdateItem/>}/>
                        <Route path='password_reset' element={<ResetPassword/>}/>
                        <Route path='logout' element={<Logout />} />
                      </Routes>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
              

            {/* Customer Routes */}
            <Route
              path='/customer/dashboard/*'
              element={
                <PrivateRoute>
                  <div className="sidewidth">        
                  <div className={`sides ${display ? 'show' : ''}`}>
                    <Custbar />
                  </div>
              
                    <div className="props p-3">
                      <Routes>
                        <Route path='customermenuDisplay' element={<MenuDisplay />} />
                        <Route path='item/:id' element={<SingleMenu/>}/>
                        <Route path='customerOrder' element={<Order />} />
                        <Route path='CustomerProfile' element={<Profile />} />
                        <Route path='CustomerReservation' element={<Reservations />} />
                        <Route path='CustomerPayment' element={<Payment />} />
                        <Route path='/' element={<Customer />} />
                        <Route path='cart' element={<Cart/>}/>
                        <Route path='receipt' element={<Receipt/>}/>
                        <Route path='notify' element={<Notify/>}/>
                        <Route path='Checkout' element={<Checkout/>}/>
                        <Route path='/logout' element={<Logout/>}></Route>
                      </Routes>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
    </>
  );
}

export default Show;

