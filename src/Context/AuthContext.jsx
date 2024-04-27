import {createContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2'
const loginurl = 'http://127.0.0.1:8000/restaurant/'
const registerurl = 'http://127.0.0.1:8000/restaurant/register'
const foodUrl = 'http://127.0.0.1:8000/restaurant/food_items'
const notificationOrderUrl = 'http://127.0.0.1:8000/restaurant/messages'
import axios from 'axios'
export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
  const data = JSON.parse(localStorage.getItem("clickedItem")) || []
 
 const [authTokens, setAuthTokens] = useState(null)
 const [user, setUser] = useState(null)
 const [Loginloading, setLoginLoading] = useState(true)
 const [loading, setLoading] = useState(true)
 const [staff, setStaff] = useState(false)
 const [customer, setCustomer] = useState(false)
 const [addItem, setAddItem] = useState([])
 const [food, setFood] = useState([])
 const [clicked, setClicked] = useState(false)
 const [total, setTotal] = useState('')
 const [showNotifications, setShowNotifications] = useState(false)
 const [orderNotify, setOrderNotify] = useState([])
 const [newData, setNewData] = useState(data)
 const [display, setDisplay] = useState(false)
 const navigate = useNavigate()

//  this is the code for removing the custbar component
const handleDisplay = ()=> {
  setDisplay(!display)
}
 
 const orderMsg = async()=>{
  try{
    const response = await axios(notificationOrderUrl)
    const data = response.data
    setOrderNotify(data)
    console.log(data)

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

const handleMessages = ()=>{
setShowNotifications(!showNotifications)
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
  setClicked(false)
};


// delete items 
const handleDelete = (id)=>{
  const addedItem = addItem.filter(item => item.id !== id)
  localStorage.setItem('clickedItem', JSON.stringify(addedItem));
 setAddItem(addedItem)
  totalAmount
}

 const loginUser = async (username, password) =>{
  setLoginLoading(true)
  axios.post(loginurl, {
    username, password
  }).then(response =>{
  if(response.status === 200){
    const data = response.data
    setAuthTokens(data)
    setUser(jwtDecode(data.access))
   let checkMember = jwtDecode(data.access)
   let decodedStaff = checkMember.is_staff
   let decodedCustomer = checkMember.is_customer
   console.log(decodedStaff, decodedCustomer)
  localStorage.setItem("authtokens", JSON.stringify(data))
  {decodedCustomer && navigate("/customer/dashboard")}
  {decodedStaff && navigate("/staff/dashboard")}
  setLoginLoading(false)
  showSuccessAlert("Login successfull")
  }else{
    showErrorAlert("Please provide correct username/password")
  }
  }).catch (err => {
    console.log("Error", err)
    showErrorAlert("There was a server issue")
    navigate("/login")
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
 }).catch (err =>{
    console.log(err)
    showErrorAlert("There was a server issue")
 })
 }

const logoutUser = ()=>{
setAuthTokens(null)
setUser(null)
localStorage.removeItem("authtokens")
showSuccessAlert("You have been logged out")
.then(()=>{
  navigate("/login")
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
      setUser(decodedUser)
      if(decodedUser.is_staff){
        navigate("/staff/dashboard")
        setStaff(true)
      }else if(decodedUser.is_customer){
        navigate("/customer/dashboard")
        setCustomer(true)
      }
    }
    setLoading(false)
}, [authTokens, loading])

const contextData = {
    user, setUser,
    authTokens, setAuthTokens,
    staff, setStaff,
    customer, setCustomer,
    loginUser, RegisterUser, logoutUser,
    showSuccessAlert, handleCart,
    setAddItem, addItem, fetchFood,
    food, setFood, data, clicked, setClicked, total,handleMessages,
    showNotifications, setShowNotifications,orderMsg, orderNotify, handleDelete, newData,
    handleDisplay, display, setDisplay, setLoginLoading, Loginloading
}
return (
    <AuthContext.Provider value={contextData}>
  {loading ? null : children}
    </AuthContext.Provider>
)
}



