import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'
import useHook from './customHook';
const foodUrl = 'http://127.0.0.1:8000/restaurant/food_items'

function SingleItem() {
 const { id } = useParams()
 const singleUrl = `http://127.0.0.1:8000/restaurant/food_items/${id}`
 const [item, setItem] = useState(null)
 const [loading, setLoading] = useState(true)
 const {food} = useHook(foodUrl)
 const navigate = useNavigate()

 const fetchData = async ()=>{
    try{
        setLoading(true)
       const response = await axios(singleUrl)
       const data = response.data
       setItem(data)
       setLoading(false)
       console.log(item)
    } catch (err){
        console.log(err)
    }
 }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/restaurant/single_item/${id}`);
      
      navigate("/staff/dashboard/menu")
    } catch (error) {
      console.log('Error deleting item:', error);
    }
  };

 useEffect(()=>{
    fetchData()
 }, [])
 return (
    <>
      {loading && (
        <div className='text-center'>
          <span className="loader"></span>
        </div>
      )}
      {item && (
        <div className="row" key={id}>
          <div className="col-md-4 col-sm-12">
            <div className="card image">
              <img src={item.image} alt={item.name} />
            </div>
          </div>
  
          <div className="col-md-4 col-sm-12">
            <h4 className='alert alert-secondary text-center'>{item.name}</h4>
  
            <h6>Description</h6>
            <p>{item.descriptions}</p>
  
            <h5>shs. {item.price}</h5>
  
            <h5 className='mt-5 text-center text-white bg-primary p-3'>more Products</h5>
  
           <Link to={`/staff/dashboard/items/${id}`}>
                
            <div className="container">
              <ul className='d-flex latest'>
                {food.slice(0, 4).map(items => {
                  const { id, image, name, price } = items;
                  return (
                    <li>
                      <div className="latestItems p-3">
                        <div className="icon">
                          <img src={image} alt={name} />
                        </div>
                        <div className="words">
                          <h4>{name}</h4>
                          <p>shs.{price}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
           </Link>
       <div className="d-flex btns">
           <button className='bg-danger text-center text-white p-2' onClick={()=>handleDelete(id)}>Delete Item</button>

           <Link to={`/staff/dashboard/update/${id}`}>
              <button className='bg-primary text-center text-white p-2 ml-3'>Edit Item</button>
           </Link>
       </div>

<Link to='/staff/dashboard/menu'>
       <button className='text-center p-2 mt-4'>Back To Menu</button>
</Link>
          </div>
        </div>
      )}
    </>
  );
}

export default SingleItem
