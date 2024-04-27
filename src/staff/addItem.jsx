import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
const url = 'http://127.0.0.1:8000/restaurant/items'

function AddItem() {
  const navigate = useNavigate()
  const [product, setProduct] = useState({pname:"", price:"", desc:"", image:null})

  const handleChange = (e)=>{
    const {name, value} = e.target
    setProduct({...product, [name]:value})
  }

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setProduct({ ...product, image: selectedFile });

    const itemImage = document.querySelector('.itemImage');
    itemImage.src = URL.createObjectURL(e.target.files[0]);
  };

const handleSubmit = (e)=>{
  e.preventDefault()
  const formData = new FormData()
  formData.append('name', product.pname);
  formData.append('price', product.price);
  formData.append('descriptions', product.desc);
  formData.append('image', product.image);

  axios.post(url, formData)
  .then(response =>{
    if(response.status === 201){
      navigate('/staff/dashboard/menu')
      setSuccessAlert("Item Added Successfully")
    }else{
      setErrorAlert("An Error Occured")
    }
  })
  .catch (err =>{
    console.log(err)
  })
}

const setSuccessAlert = (message)=>{
 Swal.fire({
  title:message,
  icon:"success",
  timer:6000,
  toast:true,
  position:'top',
  timerProgressBar:true,
  showConfirmButton:true,
 })
}

const setErrorAlert = (message)=>{
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

  return (
    <>
    <h2 className='alert alert-success text-center'>Add Items From Here</h2>
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
      name='pname'
      value={product.pname}
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
      value={product.price}
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
      name='desc'
      value={product.desc}
      onChange={handleChange}
    />
  </div>
  <div className="mb-3">
    <label htmlFor="image" className="form-label alert alert-success">
      Upload Image
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
      <img src=''  className='itemImage'/>
    </div>
  </div>

  <div className="mb-3">
   <button className='bg-primary text-white' type='submit'>Save Product</button>
  </div>
</>

</>

    </form>
    </>
  )
}

export default AddItem
