import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import myImage from '../Images/pizza2.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const registerurl = 'https://restaurant-backend5.onrender.com/restaurant/register';

function Signup() {
  const navigate = useNavigate();
  const [person, setPerson] = useState({
    username: "",
    email: "",
    password: "",
    is_staff: false,
    is_customer: true,
  });
  const [passwordError, setPasswordError] = useState([]);
  const [usernameError, setUsernameError] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
  };

  const RegisterUser = async (email, username, password, is_staff, is_customer) => {
    try {
      const response = await axios.post(registerurl, {
        username, password, email, is_staff, is_customer
      });
      if (response.status === 201) {
        showSuccessAlert("Registration successful, you can login now");
        navigate("/login");
      } else {
        showErrorAlert(`An error occurred: ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.password) {
          const passwordErrors = error.response.data.password;
          setPasswordError(passwordErrors);
        }
        if (error.response.data.username) {
          const usernameErrors = error.response.data.username;
          setUsernameError(usernameErrors);
        }
        showErrorAlert("There was a server issue");
      }
    } finally {
      setLoading(false);  // Ensure loading state is reset in both success and error cases
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading
    const { email, username, password, is_staff, is_customer } = person;
    await RegisterUser(email, username, password, is_staff, is_customer);
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: message,
      icon: "success",
      timer: 6000,
      toast: true,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: true,
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: message,
      icon: "error",
      toast: true,
      timer: 6000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: true,
    });
  };

  return (
    <>
      <h2 className='text-center'>Sign up from here</h2>
      <div className="container_sign row">
        <div className="col-md-4 col-sm-12 signImage">
          <img src={myImage} alt="Signup" />
        </div>
        <form onSubmit={handleSubmit} className='col-md-4 col-sm-12'>
          <div className="mb-3">
            <label htmlFor="formGroupExampleInput" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="formGroupExampleInput"
              name="username"
              required
              value={person.username}
              onChange={handleChange}
              placeholder="Username"
            />
            {usernameError.map((err, index) => (
              <p key={index} className='text-danger'>{err}</p>
            ))}
          </div>
          <div className="mb-3">
            <label htmlFor="formGroupExampleInput2" className="form-label">Email</label>
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
            <label htmlFor="formGroupExampleInput3" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="formGroupExampleInput3"
              name="password"
              required
              value={person.password}
              onChange={handleChange}
              placeholder="Password"
            />
            {passwordError.map((err, index) => (
              <p key={index} className='text-danger'>{err}</p>
            ))}
          </div>
          <div className="mb-3">
            <button className="bg-primary text-white text-center" type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Signup;
