import {createContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2'

const loginurl = 'https://restaurant-backend5.onrender.com/restaurant/'
const registerurl = 'https://restaurant-backend5.onrender.com/restaurant/register'
const foodUrl = 'https://restaurant-backend5.onrender.com/restaurant/food_items'
const notificationOrderUrl = 'https://restaurant-backend5.onrender.com/restaurant/messages'
const post_user_items = 'https://restaurant-backend5.onrender.com/restaurant/user_items'
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
 const [passwordError, setPasswordError] = useState([])
 const [usernameError, setUsernameError] = useState([])
 const [notifyAll, setNotifyAll] = useState([]);  // Centralized notifications state
 const [noAccount, setNoAccount] = useState('')
 
 const navigate = useNavigate()

//  this is the code for removing the custbar component
const handleDisplay = ()=> {
  setDisplay(!display)
}

useEffect(() => {
  if (user) {
    const socket = new WebSocket('wss://restaurant-backend5.onrender.com/ws/socket-server/');
    
    socket.onopen = function(e) {
      console.log('WebSocket connection established');
    };

    socket.onclose = function(e) {
      console.log('WebSocket connection closed');
    };

    socket.onmessage = function(e) {
      const data = JSON.parse(e.data);
      setNotifyAll(prev => [...prev, data]);
    };

    return () => {
      socket.close();
    }
  }
}, [user]);
 
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
  const selectedItem = addItem.find((item) => item.id === product.id);
  
  if(selectedItem){
    setAddItem(addItem.map(item => item.id === product.id ? {...selectedItem, quantity: selectedItem.quantity + 1} : item));
  }else{
   setAddItem([...addItem, {...product, quantity:1}])
 
  }
  const totalItems = addItem.map(item => {
    const {quantity} = item
    return quantity
  }).reduce((sum, amount) => sum + amount, 0)
setTotal(totalItems)

  localStorage.setItem('clickedItem', JSON.stringify(addItem));
};


// Increse product
const Increase = (product)=>{
  const selectedItem = addItem.find((item) => item.id === product.id);
  
   
  if(selectedItem){
    setAddItem(addItem.map(item => item.id === product.id ? {...selectedItem, quantity: selectedItem.quantity + 1} : item));
  }else{
   setAddItem([...addItem, {...product, quantity:1}])
 
  }
  
  localStorage.setItem('clickedItem', JSON.stringify(addItem));
}

// reduce products
// Reduce product quantity in the cart
const Reduce = (product) => {
  const selectedItem = addItem.find((item) => item.id === product.id);

  if (selectedItem && selectedItem.quantity > 1) {
    // Decrease quantity by 1 if it's greater than 1
    setAddItem(
      addItem.map((item) =>
        item.id === product.id
          ? { ...selectedItem, quantity: selectedItem.quantity - 1 }
          : item
      )
    );
  } else {
    // Remove the item from the cart if its quantity is 1
    setAddItem(addItem.filter((item) => item.id !== product.id));
  }

  // Update the total quantity in the cart
  const totalItems = addItem
    .map((item) => item.quantity)
    .reduce((sum, amount) => sum + amount, 0);
  setTotal(totalItems);

  localStorage.setItem("clickedItem", JSON.stringify(addItem));
};


// delete items 
// delete items 
const handleDelete = (id)=>{
  const updatedData = data.filter(item => item.id !== id);
  localStorage.setItem('clickedItem', JSON.stringify(updatedData));
  setAddItem(updatedData);

  // Calculate the total amount again based on updated data
  totalAmount = data.map(prices =>{
    const {price, quantity} = prices
    return price * quantity
  }).reduce((sum, amount) => sum + amount, 0).toFixed(2)
}


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
  localStorage.setItem("authtokens", JSON.stringify(data))
  {decodedCustomer && navigate("/customer/dashboard")}
  {decodedStaff && navigate("/staff/dashboard")}
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
 

 const RegisterUser = async (email, username, password, is_staff,is_customer) =>{
 axios.post(registerurl, {
  username, password, email, is_staff, is_customer
 }).then(response =>{
    console.log(response)
    if(response.status === 201){
       navigate("/login")
       showSuccessAlert("Registration successFull, you can Login now")
    }else{
        showErrorAlert(`An Error occured : ${response.status}`)
    }
 }).catch (error =>{
    if (error.response && error.response.data && error.response.data.password) {
      // Access the password text from the error response data
      const passwordErrors = error.response.data.password;
      console.log(passwordErrors);
      setPasswordError(passwordErrors)
    showErrorAlert("There was a server issue")
    }
    if(error.response && error.response.data && error.response.data.username){
      const usernameErrors = error.response.data.username;
      console.log(usernameErrors)
      setUsernameError(usernameErrors)
    showErrorAlert("There was a server issue")
    console.log(error)
}
 })
 }

 const logoutUser = () => {
  setAuthTokens(null);
  setUser(null);
  localStorage.removeItem('authtokens');
  showSuccessAlert('You have been logged out').then(() => {
    navigate('/login');
  });
};


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
  const initialTokens = JSON.parse(localStorage.getItem('authtokens'));
    if(initialTokens){
      const decodedUser =  jwtDecode(initialTokens.access)
      setAuthTokens(initialTokens);
      setUser(jwtDecode(initialTokens.access));
      if(decodedUser.is_staff){
        navigate("/staff/dashboard")
        setStaff(true)
      }else if(decodedUser.is_customer){
        navigate("/customer/dashboard")
        setCustomer(true)
      }
    }
    setLoading(false)
}, [])

const contextData = {
    user, setUser,
    authTokens, setAuthTokens,
    staff, setStaff,
    customer, setCustomer,
    loginUser, RegisterUser,
    showSuccessAlert, handleCart,
    setAddItem, addItem, fetchFood,
    food, setFood, data, clicked, setClicked, total,handleAllMessages,
    showNotifications,showNotificationsAll,setShowNotifications,setShowNotificationsAll,orderMsg, orderNotify,handleDelete,
    handleDisplay, display, setDisplay,Increase, Reduce, passwordError, usernameError,handleMessage, notifyAll,
    setNotifyAll,noAccount,logoutUser
}
return (
    <AuthContext.Provider value={contextData}>
  {loading ? null : children}
    </AuthContext.Provider>
)
}
