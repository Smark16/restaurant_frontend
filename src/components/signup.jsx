import React, { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import myImage from '../Images/pizza2.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';

function Signup() {
  const { RegisterUser } = useContext(AuthContext);
  const [person, setPerson] = useState({
    username: "",
    email: "",
    password: "",
    is_staff: false,
    is_customer: false,
  });
  // const [staff, setStaff] = useState(false)
  // const [customer, setCustomer] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
  };

  const handleMember = (e) => {
    const selectedValue = e.target.value
    console.log(selectedValue)
  if(selectedValue === 'Staff'){
    return setPerson({...person, is_staff:true, is_customer:false})
  }else{
    return setPerson({...person, is_staff:false, is_customer:true})
  }

  };
  console.log(person)
  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, username, password, is_staff, is_customer } = person;
    RegisterUser(email, username, password, is_staff, is_customer);
  };

  return (
    <>
      <h2 className='text-center'>Sign up from here</h2>

      <div className="container row">
        <div className="col-md-4 col-sm-12 signImage">
          <img src={myImage}></img>
        </div>


        <form onSubmit={handleSubmit} className='col-md-4 col-sm-12'>
        <div className="mb-3">
          <label htmlFor="formGroupExampleInput" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput"
            name="username"
            value={person.username}
            onChange={handleChange}
            placeholder="username"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="formGroupExampleInput2" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="formGroupExampleInput2"
            name="email"
            value={person.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="formGroupExampleInput3" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="formGroupExampleInput2"
            name="password"
            value={person.password}
            onChange={handleChange}
            placeholder="password"
          />
        </div>

        <div className="mb-3">
          <select name="members" onChange={handleMember}>
            <option>Choose</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
          </select>
        </div>

        <div className="mb-3">
          <button className="bg-primary text-white text-center" type="submit">
            Sign up
          </button>
        </div>
      </form>
      </div>

    </>
  );
}

export default Signup;
