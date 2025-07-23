import {createContext, useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
//import { tokenGeneration } from '../components/firebase';
import Swal from 'sweetalert2'

const loginurl = 'https://restaurant-backend5.onrender.com/restaurant/'

import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{  
 const [authTokens, setAuthTokens] = useState(() => JSON.parse(localStorage.getItem('authtokens')) || null);
 const [user, setUser] = useState(() => (authTokens ? jwtDecode(authTokens.access) : null));
 const [loading, setLoading] = useState(true)
 const [staff, setStaff] = useState(user ? user.is_staff : false)
 const [customer, setCustomer] = useState(user ? user.is_customer : false)
 const [addItem, setAddItem] = useState(()=> {
    const storedItems = JSON.parse(localStorage.getItem('clickedItem')) || [];
    return storedItems;
})
 const [food, setFood] = useState([])
 const [clicked, setClicked] = useState(false)
 const [total, setTotal] = useState('')
 const [noAccount, setNoAccount] = useState('')
 

 const [showUserNotifications, setShowUserNotifications] = useState(false)
 const [unreadUserNotifications, setUnreadUserNotifications] = useState([])

//  live updates
const [CurrentOrders, setCurrentOrders] = useState('')
const [catPerfomance, setCatPerfomnace] = useState('')
 
 const navigate = useNavigate()

//  websocket Intergration
const websocket = useRef(null)

useEffect(()=>{
  if(user){

    const tokenString = localStorage.getItem('authtokens');
    const token = tokenString ? JSON.parse(tokenString) : null;

    websocket.current  = new WebSocket(`wss://restaurant-backend5.onrender.com/ws/user_updates/?token=${token.access}`)
  
    websocket.current.onopen = ()=>{
      console.log('connection established')
    }
  
    websocket.current.onmessage = (event)=>{
      console.log('received', JSON.parse(event.data))
      const data = JSON.parse(event.data)

      if(data.type === 'live_updates'){
        setCatPerfomnace(data.category_perfomance)
        setCurrentOrders(data.today_orders)
      }
    }
  
    
    websocket.current.onclose = () => {
      console.log('WebSocket connection disconnected');
    };
  
    websocket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }
}, [user])
 
   // Add item to cart
  const handleCart = (product) => {
    setAddItem((prevAddItem) => {
      const newItem = {
        menu: product?.id,
        quantity: 1,
        product: product,
      }
      const selectedItem = prevAddItem.find((item) => item.menu === newItem.menu)

      let newAddItem
      if (selectedItem) {
        newAddItem = prevAddItem.map((item) =>
          item.menu === newItem.menu ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        newAddItem = [...prevAddItem, newItem]
      }

      // Update total quantity
      const totalItems = newAddItem.reduce((sum, item) => sum + item.quantity, 0)
      setTotal(totalItems)

      // Update localStorage
      localStorage.setItem('clickedItem', JSON.stringify(newAddItem))

      return newAddItem
    })
  }

  // Increase product quantity
  const Increase = (product) => {
    setAddItem((prevAddItem) => {
      const selectedItem = prevAddItem.find((item) => item.menu === product.id)

      // Increment quantity of existing item
      const updatedItems = prevAddItem.map((item) =>
        item.menu === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )

      // Update localStorage and total
      localStorage.setItem('clickedItem', JSON.stringify(updatedItems))
      setTotal(updatedItems.reduce((sum, item) => sum + item.quantity, 0))

      return updatedItems
    })
  }

  // Reduce product quantity
  const Reduce = (product) => {
    setAddItem((prevAddItem) => {
      const selectedItem = prevAddItem.find((item) => item.menu === product.id)

      if (!selectedItem) {
        return prevAddItem // Do nothing if item doesn't exist
      }

      let updatedItems
      if (selectedItem.quantity > 1) {
        // Decrease quantity if greater than 1
        updatedItems = prevAddItem.map((item) =>
          item.menu === product.id ? { ...item, quantity: item.quantity - 1 } : item
        )
      } else {
        // Remove item if quantity is 1
        updatedItems = prevAddItem.filter((item) => item.menu !== product.id)
      }

      // Update localStorage and total
      localStorage.setItem('clickedItem', JSON.stringify(updatedItems))
      setTotal(updatedItems.reduce((sum, item) => sum + item.quantity, 0))

      return updatedItems
    })
  }

  // Delete item from cart
  const handleDelete = (menuId) => {
    setAddItem((prevAddItem) => {
      const updatedItems = prevAddItem.filter((item) => item.menu !== menuId)

      // Update localStorage and total
      localStorage.setItem('clickedItem', JSON.stringify(updatedItems))
      setTotal(updatedItems.reduce((sum, item) => sum + item.quantity, 0))

      return updatedItems
    })
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
  // fetchFood()
  if(authTokens){
    const decodedUser =  jwtDecode(authTokens.access)
    const lastPath = localStorage.getItem('lastPath');
    setUser(decodedUser);
    setStaff(decodedUser.is_staff)
    setCustomer(decodedUser.is_customer)
    if(decodedUser.is_staff){
      navigate(lastPath);
      setStaff(true)
    }else if(decodedUser.is_customer){
      navigate(lastPath);
      setCustomer(true)
    }
    if (lastPath) {
      navigate(lastPath);  // Redirect to last accessed page if available
      localStorage.removeItem('lastPath');  // Clear after redirecting
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
    showSuccessAlert, showErrorAlert ,handleCart,
    setAddItem, addItem,
    food, setFood, clicked, setClicked, total,handleDelete,
   Increase, Reduce, noAccount,setTotal,
    showUserNotifications, setShowUserNotifications,
    unreadUserNotifications, setUnreadUserNotifications,
    websocket,
    CurrentOrders, setCurrentOrders,
    catPerfomance, setCatPerfomnace

}
return (
    <AuthContext.Provider value={contextData}>
  {loading ? null : children}
    </AuthContext.Provider>
)
}
