import React, { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import myImage from '../Images/pizza2.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';

function Signup() {
  const { RegisterUser, passwordError, usernameError } = useContext(AuthContext);
  const [validate, setValidate] = useState('')
  const [person, setPerson] = useState({
    username: "",
    email: "",
    password: "",
    is_staff: false,
    is_customer:true,
  });
  // const [staff, setStaff] = useState(false)
  // const [customer, setCustomer] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
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
            required
            value={person.username}
            onChange={handleChange}
            placeholder="username"
          />
          {usernameError.map(err =>{
            return (
              <p className='text-danger'>{err}</p>
            )
          })}
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
            required
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
            required
            value={person.password}
            onChange={handleChange}
            placeholder="password"
          />

          {passwordError.map(err =>{
            return (
              <p className='text-danger'>{err}</p>
            )
          })}
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
