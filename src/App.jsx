// App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Bar from './components/Navbar';
import Home from './components/Home';
import Login from './components/login';
import Logout from './staff/logout';
import Signup from './components/signup';
import { AuthProvider} from './Context/AuthContext';
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
// import { AuthContext } from './Context/AuthContext';


function App() {
  //const {display} = useContext(AuthContext)
  return (
    <>
      <Router>
        <AuthProvider>
          <Bar />
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/changePassword' element={<ChangePassword/>}/>

            {/* Staff Routes */}
            <Route
              path='/staff/dashboard/*'
              element={
                <PrivateRoute>
                  <div className="sidewidth">
                    <div className="sidebar">
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
                  <div className="sides">
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
                        <Route path='/logout' element={<Logout/>}></Route>
                      </Routes>
                    </div>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;

