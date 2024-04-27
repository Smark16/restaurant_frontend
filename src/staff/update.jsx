import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

function UpdateItem() {
  const {id} = useParams()
  const navigate = useNavigate()
//   const [product, setProduct] = useState({name:"", price:"", desc:"", image:null})
  const [item, setItem] = useState({name:"", price:"", descriptions:"", image:null})
  const singleUrl = `http://127.0.0.1:8000/restaurant/food_items/${id}`
  const url = `http://127.0.0.1:8000/restaurant/update_order/${id}`

  const fetchData = async ()=>{
    try{
       const response = await axios(singleUrl)
       const data = response.data
       setItem(data)
       console.log(item)
    } catch (err){
        console.log(err)
    }
 }

useEffect(()=>{
    fetchData()
}, [])

  const handleChange = (e)=>{
    const {name, value} = e.target
    setItem({...item, [name]:value})
  }

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setItem({ ...item, image: selectedFile });

    const itemImage = document.querySelector('.itemImage');
    itemImage.src = URL.createObjectURL(e.target.files[0]);
  };

  console.log(item)

const handleSubmit = async(e)=>{
  e.preventDefault()
  const formData = new FormData()
  formData.append('name', item.name);
  formData.append('price', item.price);
  formData.append('descriptions', item.descriptions);
  
  if (item.image && typeof item.image === 'string') {
    try {
      // Download the image from the URL
      const imageResponse = await axios.get(item.image, { responseType: 'blob' });
      const imageBlob = new Blob([imageResponse.data], { type: imageResponse.headers['content-type'] });
      const imageFile = new File([imageBlob], 'image.jpg'); // You can specify the filename here
      

      // Append the downloaded image file to the form data
      formData.append('image', imageFile);
      
      axios.put(url, formData)
      .then(response =>{
        if(response.status === 201){
          navigate(`/staff/dashboard/items/${id}`)
          setSuccessAlert("Item Updated Successfully")
        }else if(response.status === 400){
          setErrorAlert("An Error Occured")
        }
      })
      .catch (err =>{
        console.log(err)
      })
    }
catch (error) {
      console.error('Error downloading image:', error);
    }
  }
  }

const setSuccessAlert = (message)=>{
 Swal.fire({
  title:message,
  icon:"success",
  timer:6000,
  toast:true,
  position:'top',
  timerProgressBar:true,
  showConfirmButton:false,
 })
}

const setErrorAlert = (message)=>{
  Swal.fire({
    title:response.data.image,
    icon:"error",
    toast:true,
    timer:6000,
    position:"top-right",
    timerProgressBar:true,
    showConfirmButton:false,
  })
}

  return (
    <>
    <h2 className='alert alert-success text-center'>Edit Items From Here</h2>
    <form onSubmit={handleSubmit}>
    <>
  <div className="mb-3">
    <label htmlFor="formGroupExampleInput" className="form-label">
      Product Name
    </label>
    <input
      type="text"
      className="form-control"
      id="formGroupExampleInput"
      placeholder="product Name"
      name='name'
      value={item.name}
      onChange={handleChange}
    />
  </div>
  <div className="mb-3">
    <label htmlFor="formGroupExampleInput2" className="form-label">
      Price
    </label>
    <input
      type="number"
      className="form-control"
      id="formGroupExampleInput2"
      placeholder="Enter Price"
      name='price'
      value={item.price}
      onChange={handleChange}
    />
  </div>

  <>
  <div className="mb-3">
    <label htmlFor="formGroupExampleInput" className="form-label">
      Description
    </label>
    <textarea
      type="text"
      className="form-control"
      id="formGroupExampleInput"
      name='descriptions'
      value={item.descriptions}
      onChange={handleChange}
    />
  </div>
  <div className="mb-3">
    <label htmlFor="image" className="form-label alert alert-success">
      Change Image
    </label>
    <input
      type="file"
      accept='image/jpg, image/jpeg'
      className="form-control"
      id="image"
      placeholder="Another input placeholder"
      hidden='true'
      onChange={handleImageChange}
    />

    <div>
      <img src={item.image}  className='itemImage'/>
    </div>
  </div>

  <div className="mb-3">
   <button className='bg-primary text-white' type='submit'>Update Product</button>
  </div>
</>

</>

    </form>
    </>
  )
}

export default UpdateItem
