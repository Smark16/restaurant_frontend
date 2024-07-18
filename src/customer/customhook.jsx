import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

function useHook(notificationOrderUrl) {
    const [orderNotify, setOrderNotify] = useState([])
    const {user} = useContext(AuthContext)
    // const notificationOrderUrl =  `http://127.0.0.1:8000/restaurant/usermsg/${user.user_id}`
     
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

   useEffect(()=>{
    orderMsg()
   }, [])

  return (
    {orderNotify}
  )
}

export default useHook;