// App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, lazy, Suspense } from 'react';
import {Route, Routes} from 'react-router-dom';
import { CircularProgress } from '@mui/material'
import './App.css';
import PrivateRoute from './components/privateRoute';
import Sidebar from './staff/Sidebar';
import { AuthContext } from './Context/AuthContext';
import { tokenGeneration } from './components/firebase';
import { onMessage } from 'firebase/messaging';
import toast, { Toaster } from 'react-hot-toast';
import NetworkStatus from './components/NetworkCheck';
import InstallPWAButton from './components/Reusables/InstallPWAButton';

const Home = lazy(()=>import('./components/Home'));
const Login = lazy(()=>import('./components/login'));
const Logout = lazy(()=>import('./staff/logout'));
const Signup = lazy(()=>import('./components/signup'));
const Staff  = lazy(()=>import('./staff/Staff'));
const Customer = lazy(()=>import('./customer/Customer'));
const Menu = lazy(()=>import('./staff/Menu'));
const OrdersManagement = lazy(()=>import('./staff/Orders'));
const Reservation = lazy(()=>import('./staff/Reservation'));
const MenuAnalytics = lazy(()=>import('./staff/MenuAnalytics'));
const AddItem = lazy(()=>import('./staff/addItem'));
const SingleItem = lazy(()=>import('./staff/singleItem'));
const Custbar = lazy(()=>import('./customer/Custbar'));
const Order = lazy(()=>import('./customer/Order'));
const Reservations = lazy(()=>import('./customer/Reservation'));
const EnhancedMenuDisplay = lazy(()=>import('./customer/Menu'));
const UpdateItem = lazy(()=>import('./staff/update'));
const ForgotPassword = lazy(()=>import('./components/forgotPassword'));
const SingleMenu = lazy(()=>import('./customer/singleItem'));
const Cart = lazy(()=>import('./customer/cart'));
const About = lazy(()=>import('./LandingPage/about'));
const Booking = lazy(()=>import('./LandingPage/booking'));
const Contact = lazy(()=>import('./LandingPage/contact'));
const Testimonial = lazy(()=>import('./LandingPage/testimonial'));
const Service = lazy(()=>import('./LandingPage/service'));
const Team = lazy(()=>import('./LandingPage/team'));
const Menus = lazy(()=>import('./LandingPage/menu'));
const Index = lazy(()=>import('./LandingPage'));
const CustomerProfileManagement = lazy(()=>import('./customer/Profile'));
const ProfileManagement = lazy(()=>import('./staff/Profile'));
const Checkout = lazy(()=>import('./customer/checkout'));
const PaymentStatus = lazy(()=>import('./customer/pesapal_callback'))

function Show() {
  const {messaging, generateToken} = tokenGeneration()

  const LoadingSpinner = () => (
    <div className="center-content">
      <CircularProgress size={40} sx={{color:'#600018'}}/>
    </div>
  );

  useEffect(() => {
    generateToken();
  
    const unsubscribe = onMessage(messaging, (payload) => {
      if (payload.notification && payload.notification.body) {
        // const newNotification = {
        //   user: user?.user_id,
        //   message: payload.notification.body,
        // };
  
        toast(payload.notification.body);
        // setNotifications((prev) => [...prev, newNotification]);
  
        // Ensure `notifications` is used to calculate unread count
        // setNotificationCount((prevCount) => prevCount + 1);
      } else {
        console.error("Notification payload is incorrect or missing");
      }
    });
  
    return () => unsubscribe(); // Cleanup function to avoid memory leaks
  }, [messaging, generateToken]);

  return (
    <>
      <InstallPWAButton />
     <Toaster position='top-right'/> 
     <NetworkStatus/>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Suspense fallback={<LoadingSpinner/>}><Home /></Suspense>} />
            <Route path='/login' element={<Suspense fallback={<LoadingSpinner/>}><Login /></Suspense>} />
            <Route path='/signup' element={<Suspense fallback={<LoadingSpinner/>}><Signup /></Suspense>} />
            <Route path='/forgot-password' element={<Suspense fallback={<LoadingSpinner/>}><ForgotPassword/></Suspense>}/>
            <Route path='/index' element={<Suspense fallback={<LoadingSpinner/>}><Index/></Suspense>}></Route>
            <Route path='/about' element={<Suspense fallback={<LoadingSpinner/>}><About/></Suspense>}></Route>
            <Route path='/booking' element={<Suspense fallback={<LoadingSpinner/>}><Booking/></Suspense>}></Route>
            <Route path='/contact' element={<Suspense fallback={<LoadingSpinner/>}><Contact/></Suspense>}></Route>
            <Route path='/menus' element={<Suspense fallback={<LoadingSpinner/>}><Menus/></Suspense>}></Route>
            <Route path='/team' element={<Suspense fallback={<LoadingSpinner/>}><Team/></Suspense>}></Route>
            <Route path='/testimonial' element={<Suspense fallback={<LoadingSpinner/>}><Testimonial/></Suspense>}></Route>
            <Route path='/service' element={<Suspense fallback={<LoadingSpinner/>}><Service/></Suspense>}></Route>

            {/* Staff Routes */}
            <Route
              path='/staff/dashboard/*'
              element={
                <PrivateRoute>
                  <div className="sidewidth">
                    <div>
                      <Sidebar />
                    </div>
                    <div className="props p-3 mt-4">
                      <Routes>
                        <Route path='menu' element={<Suspense fallback={<LoadingSpinner/>}><Menu /></Suspense>} />
                        <Route path='orders' element={<Suspense fallback={<LoadingSpinner/>}><OrdersManagement /></Suspense>} />
                        <Route path='reservations' element={<Suspense fallback={<LoadingSpinner/>}><Reservation /></Suspense>} />
                        <Route path='/' element={<Suspense fallback={<LoadingSpinner/>}><Staff /></Suspense>} />
                        <Route path='addItem' element={<Suspense fallback={<LoadingSpinner/>}><AddItem/></Suspense>}/>
                        <Route path='analytics' element={<Suspense fallback={<LoadingSpinner/>}><MenuAnalytics /></Suspense>} />
                        <Route path='profile' element={<Suspense fallback={<LoadingSpinner/>}><ProfileManagement/></Suspense>}/>
                        <Route path='items/:id' element={<Suspense fallback={<LoadingSpinner/>}><SingleItem/></Suspense>}/>
                        <Route path='update/:id' element={<Suspense fallback={<LoadingSpinner/>}><UpdateItem/></Suspense>}/>
                        <Route path='logout' element={<Suspense fallback={<LoadingSpinner/>}><Logout /></Suspense>} />
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
                  <div>
                    <Custbar />
                  </div>
              
                    <div className="props p-3 mt-4">
                      <Routes>
                        <Route path='customermenuDisplay' element={<Suspense fallback={<LoadingSpinner/>}><EnhancedMenuDisplay /></Suspense>} />
                        <Route path='item/:id' element={<Suspense fallback={<LoadingSpinner/>}><SingleMenu/></Suspense>}/>
                        <Route path='customerOrder' element={<Suspense fallback={<LoadingSpinner/>}><Order /></Suspense>} />
                        <Route path='CustomerProfile' element={<Suspense fallback={<LoadingSpinner/>}><CustomerProfileManagement /></Suspense>} />
                        <Route path='CustomerReservation' element={<Suspense fallback={<LoadingSpinner/>}><Reservations /></Suspense>} />
                        <Route path='/' element={<Suspense fallback={<LoadingSpinner/>}><Customer /></Suspense>} />
                        <Route path='cart' element={<Suspense fallback={<LoadingSpinner/>}><Cart/></Suspense>}/>
                        <Route path='Checkout' element={<Suspense fallback={<LoadingSpinner/>}><Checkout/></Suspense>}/>
                        <Route path='pesapal-callback' element={<Suspense fallback={<LoadingSpinner/>}><PaymentStatus/></Suspense>}/>
                        <Route path='/logout' element={<Suspense fallback={<LoadingSpinner/>}><Logout/></Suspense>}></Route>
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

