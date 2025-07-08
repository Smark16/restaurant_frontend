import {createContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
//import { tokenGeneration } from '../components/firebase';
import Swal from 'sweetalert2'

const loginurl = 'http://127.0.0.1:8000/restaurant/'
const foodUrl = 'https://restaurant-backend5.onrender.com/restaurant/food_items'
const notificationOrderUrl = 'https://restaurant-backend5.onrender.com/restaurant/messages'

import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{  
 const [authTokens, setAuthTokens] = useState(() => JSON.parse(localStorage.getItem('authtokens')) || null);
 const [user, setUser] = useState(() => (authTokens ? jwtDecode(authTokens.access) : null));
 const [loading, setLoading] = useState(true)
 const [staff, setStaff] = useState(user ? user.is_staff : false)
 const [customer, setCustomer] = useState(user ? user.is_customer : false)
//  const [takenItem, setTakenItem] = useState({menu:"", quantity:0})
 const [addItem, setAddItem] = useState(()=> {
    const storedItems = JSON.parse(localStorage.getItem('cartItem')) || [];
    return storedItems;
})
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
    food, setFood, clicked, setClicked, total,
    showNotifications,showNotificationsAll,setShowNotifications,setShowNotificationsAll,orderMsg, orderNotify,handleDelete,
    handleDisplay, display, setDisplay,Increase, Reduce, notifyAll,
    setNotifyAll,noAccount,setTotal,setOrderNotify
}
return (
    <AuthContext.Provider value={contextData}>
  {loading ? null : children}
    </AuthContext.Provider>
)
}
