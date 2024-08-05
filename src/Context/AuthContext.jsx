import {createContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
//import { tokenGeneration } from '../components/firebase';
import Swal from 'sweetalert2'

const loginurl = 'https://restaurant-backend5.onrender.com/restaurant/'
const foodUrl = 'https://restaurant-backend5.onrender.com/restaurant/food_items'
const notificationOrderUrl = 'https://restaurant-backend5.onrender.com/restaurant/messages'

import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
  const data = JSON.parse(localStorage.getItem("clickedItem")) || []
  
 const [authTokens, setAuthTokens] = useState(() => JSON.parse(localStorage.getItem('authtokens')) || null);
 const [user, setUser] = useState(() => (authTokens ? jwtDecode(authTokens.access) : null));
 const [loading, setLoading] = useState(true)
 const [staff, setStaff] = useState(user ? user.is_staff : false)
 const [customer, setCustomer] = useState(user ? user.is_customer : false)
 const [addItem, setAddItem] = useState([])
 const [food, setFood] = useState([])
 const [clicked, setClicked] = useState(false)
 const [total, setTotal] = useState('')
 const [showNotifications, setShowNotifications] = useState(false)
 const [showNotificationsAll, setShowNotificationsAll] = useState(false)
 const [orderNotify, setOrderNotify] = useState([])
 const [display, setDisplay] = useState(true)
 const [notifyAll, setNotifyAll] = useState([]);  // Centralized notifications state
 const [noAccount, setNoAccount] = useState('')
 //const {messaging, generateToken} = tokenGeneration()
 
 const navigate = useNavigate()

//  this is the code for removing the custbar component
const handleDisplay = ()=> {
  setDisplay(!display)
}

// useEffect(() => {
//   if (user) {

//     const socket = new WebSocket(user.is_staff 
//       ? `wss://restaurant-backend5.onrender.com/ws/admin/${user.user_id}/`
//       : `wss://restaurant-backend5.onrender.com/ws/customer/${user.user_id}/`)
//     socket.onopen = function(e) {
//       console.log('WebSocket connection established');
//     };

//     socket.onclose = function(e) {
//       console.log('WebSocket connection closed');
//     };

//     socket.onmessage = function(e) {
//       const data = JSON.parse(e.data);
//       setNotifyAll(prev => [...prev, data]);
//     };

//     return () => {
//       socket.close();
//     }
//   }
// }, [user]);
 
// this manages notificatios for all the user
 const orderMsg = async()=>{
  try{
    const response = await axios(notificationOrderUrl)
    const data = response.data
    setOrderNotify(data)
    // console.log(data)

  }catch(err){
    console.log('There was an error')
  }
 }

 
 const fetchFood = async ()=>{
  try {
    const response = await axios(foodUrl)
    const data = response.data
    setFood(data)
  }catch (err){
   console.log("there was an error")
  }
}

// define setNotify (the issue is here notifyall is not defined and its i dont know how to manage this notifyAll array so that it can be passed to reservation and cart.jsx component instead of distructuring ordernotify which is then not used in navbar for single user notitifications hope you get what i mean)
const handleMessage = ()=>{
  setShowNotifications(!showNotifications)
  if(showNotifications){
    setNotifyAll([])
  }
}

// this function dispalys the notifications when clicked
const handleAllMessages = ()=>{
  setShowNotificationsAll(!showNotificationsAll)
  if(showNotificationsAll){
    setOrderNotify([])
  }
  }


  const handleCart = (product) => {
    setAddItem((prevAddItem) => {
      const selectedItem = prevAddItem.find((item) => item.id === product.id);
  
      let newAddItem;
      if (selectedItem) {
        newAddItem = prevAddItem.map((item) =>
          item.id === product.id ? { ...selectedItem, quantity: selectedItem.quantity + 1 } : item
        );
      } else {
        newAddItem = [...prevAddItem, { ...product, quantity: 1 }];
      }
  
      const totalItems = newAddItem.reduce((sum, item) => sum + item.quantity, 0);
      setTotal(totalItems);
  
      // Update localStorage after the state update
      localStorage.setItem('clickedItem', JSON.stringify(newAddItem));
      
      return newAddItem;
    });
  };
  

console.log(total)
// Increse product
const Increase = (product) => {
  setAddItem((prevAddItem) => {
    const updatedAddItem = prevAddItem.map(item => 
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
    
    localStorage.setItem('clickedItem', JSON.stringify(updatedAddItem));
    return updatedAddItem;
  });

  // Update the total quantity in the cart
  const totalItems = addItem.reduce((sum, item) => sum + item.quantity, 0);
  setTotal(totalItems);
};

// reduce products
const Reduce = (product) => {
  setAddItem((prevAddItem) => {
    const selectedItem = prevAddItem.find(item => item.id === product.id);

    let updatedAddItem;
    if (selectedItem && selectedItem.quantity > 1) {
      updatedAddItem = prevAddItem.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
      );
    } else {
      updatedAddItem = prevAddItem.filter(item => item.id !== product.id);
    }

    localStorage.setItem('clickedItem', JSON.stringify(updatedAddItem));
    return updatedAddItem;
  });

  // Update the total quantity in the cart
  const totalItems = addItem.reduce((sum, item) => sum + item.quantity, 0);
  setTotal(totalItems);
};


// delete items 
const handleDelete = (id) => {
  const updatedData = data.filter(item => item.id !== id);
  localStorage.setItem('clickedItem', JSON.stringify(updatedData));
  setAddItem(updatedData);

  // Calculate the total amount again based on updated data
  const totalAmount = updatedData.map(prices => {
    const { quantity } = prices;
    return quantity;
  }).reduce((sum, amount) => sum + amount, 0);

  setTotal(totalAmount); // Update the state with the new total amount
};

 const loginUser = async (username, password) =>{
  axios.post(loginurl, {
    username, password
  }).then(response =>{
  if(response.status === 200){
    
    const data = response.data
    setAuthTokens(data)
    setUser(jwtDecode(data.access))
    // setUserId(localStorage.setItem('user_id', user.user_id))
   let checkMember = jwtDecode(data.access)
   let decodedStaff = checkMember.is_staff
   let decodedCustomer = checkMember.is_customer
   console.log(decodedStaff, decodedCustomer)
  localStorage.setItem('authtokens', JSON.stringify(data))
  {decodedCustomer && navigate("/customer/dashboard")}
  {decodedStaff && navigate("/staff/dashboard")}
  //generateToken();
  showSuccessAlert("Login successfull")
  }else{
    showErrorAlert("Please provide correct username/password")
  }
  }).catch (err => {
    console.log("Error", err)
    if(err.response.data.detail){
      setNoAccount(err.response.data.detail)
    }
    showErrorAlert("There was a server issue")
  })
 }
 

const showSuccessAlert =(message)=>{
    Swal.fire({
        title:message,
        icon:"success",
        timer:6000,
        toast:true,
        position:'top-right',
        timerProgressBar:true,
        showConfirmButton:true,
    })
}

const showErrorAlert =(message)=>{
 Swal.fire({
    title:message,
    icon:"error",
    toast:true,
    timer:6000,
    position:"top-right",
    timerProgressBar:true,
    showConfirmButton:true,

 })
}

useEffect(()=>{
  orderMsg()
  fetchFood()
  if(authTokens){
    const decodedUser =  jwtDecode(authTokens.access)
    setUser(decodedUser);
    setStaff(decodedUser.is_staff)
    setCustomer(decodedUser.is_customer)
    if(decodedUser.is_staff){
      navigate("/staff/dashboard")
      setStaff(true)
    }else if(decodedUser.is_customer){
      navigate("/customer/dashboard")
      setCustomer(true)
    }
  }
  setLoading(false)     
}, [authTokens])

const contextData = {
    user, setUser,
    authTokens, setAuthTokens,
    staff, setStaff,
    customer, setCustomer,
    loginUser,
    showSuccessAlert, handleCart,
    setAddItem, addItem, fetchFood,
    food, setFood, data, clicked, setClicked, total,handleAllMessages,
    showNotifications,showNotificationsAll,setShowNotifications,setShowNotificationsAll,orderMsg, orderNotify,handleDelete,
    handleDisplay, display, setDisplay,Increase, Reduce, handleMessage, notifyAll,
    setNotifyAll,noAccount,setTotal,setOrderNotify
}
return (
    <AuthContext.Provider value={contextData}>
  {loading ? null : children}
    </AuthContext.Provider>
)
}
