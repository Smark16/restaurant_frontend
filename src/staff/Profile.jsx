import React, { useContext, useEffect, useState } from 'react';
import '../staff/staff.css';
import { AuthContext } from '../Context/AuthContext';
import useAxios from '../components/useAxios';
import axios from 'axios';
import Swal from 'sweetalert2';
const ProfileUrl = 'https://restaurant-backend5.onrender.com/restaurant/profiles';
const changePassword = 'https://restaurant-backend5.onrender.com/restaurant/change-password/';

function Profile() {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const updateUser = `https://restaurant-backend5.onrender.com/restaurant/update_user/${user.user_id}`;
  const getUser = `https://restaurant-backend5.onrender.com/restaurant/get_user/${user.user_id}`;
  const [status, setStatus] = useState(false);
  const [profileImage, setProfileImage] = useState([]);
  const [profile, setProfile] = useState({ email: "", location: "", contact: "", image: null });
  const [myUser, setMyUser] = useState({ username: "", is_staff: "", is_customer: "",date_joined:"", email:"" });
  const [error, setError] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false)

  const updateProfileUrl = `https://restaurant-backend5.onrender.com/restaurant/update_profile/${user.user_id}`;
  const url = `https://restaurant-backend5.onrender.com/restaurant/profile/${user.user_id}`;
  
 
  const fetchProfiles = async () => {
    try {
      const response = await axios.get(ProfileUrl);
      const data = response.data;
      const images = data.filter(image => image.id === user.user_id);
      setProfileImage(images);
    } catch (error) {
      console.log(error);
    }
  };

  const profileData = async () => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      setProfile(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(getUser);
      const data = response.data;
      setMyUser(data);
    } catch (err) {
      console.log("there was a server error");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const changeImage = (e) => {
    const selectedFile = e.target.files[0];

    const pimg = document.querySelector(".resize-image");
    pimg.src = URL.createObjectURL(selectedFile);

    setProfile({ ...profile, image: selectedFile });
  };

 
  const handleUser = (e) => {
    const { name, value } = e.target;
    setMyUser({ ...myUser, [name]: value });
  };

 
  const handleSubmit = async (e) => {
    setUpdate(true)
    e.preventDefault();
    const formData = new FormData();
    const userData = new FormData()
    userData.append('username', myUser.username);
    userData.append('email', myUser.email);
    userData.append("date_joined", myUser.date_joined)
    formData.append("is_staff", myUser.is_staff)
    formData.append("is_customer", myUser.is_customer)
    formData.append('location', profile.location);
    formData.append('contact', profile.contact);
    formData.append('email', profile.email)
  
    // Only append the image if it has been changed
    if (profile.image && typeof profile.image !== 'string') {
      formData.append('image', profile.image);
    }
  
    try {
      const res = await axiosInstance.put(updateProfileUrl, formData);
      const userres = await axiosInstance.put(updateUser, userData)

      if (res.status === 201 && userres.status === 200) {
        showSuccessAlert("Profile Updated");
        setUpdate(false)
      }
    } catch (err) {
      console.log('There is an error', err);
    }
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: message,
      icon: "success",
      timer: 2000,
    });
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setStatus(true)

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setStatus(false)
      return;
    }

    const formData = new FormData();
    formData.append("old_password", oldPassword);
    formData.append("password", newPassword);
    formData.append("password2", confirmPassword);

    try {
      const response = await axiosInstance.put(changePassword, formData);
      setMessage(response.data.message);
      setStatus(false)
    } catch (error) {
      const errorMsg = error.response.data;
      if (errorMsg.old_password) {
        setMessage(errorMsg.old_password);
      } else {
        setMessage("An error occurred. Please try again.");
      }
      setStatus(false)
    }
  };


  useEffect(() => {
    fetchProfiles();
    profileData();
    fetchUser();
   
  }, [user]);

  return (
    <>
      <div className='profile bg-primary text-center text-white p-3'>
        <h4>View Profile</h4>
      </div>
      <div className="container">
        <div className="col-sm-2 pimage">
          {profileImage.map((myImage) => {
            const { image } = myImage;
            return (
              <React.Fragment key={myImage.id}>
                <input type='file' accept='image/jpg, image/jpeg' id='pimg' hidden onChange={changeImage} />
                <label htmlFor='pimg'>
                  <img className='resize-image' src={image} alt="Profile" />
                </label>
              </React.Fragment>
            );
          })}
        </div>
        <div className="row">
          <div className="col-md-5">
          <div>
              <span>Status: {user.is_staff ? 'Staff' : 'Customer'}</span>
            </div>
           
            <div>
              <span>Username: {myUser.username}</span>
            </div>
            <div>
              <span>Email: {myUser.email}</span>
            </div>

            <div>
              <span>Contact: {profile.contact}</span>
            </div>
           
            <div>
              <span>Location: {profile.location}</span>
            </div>

            <div>
              <span>Date Joined: {myUser.date_joined}</span>
            </div>

          </div>
          <form className='p-3 col-md-8' onSubmit={handleSubmit}>
            <h5 className='text-center'>Edit Profile</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row g-3 mt-3">
             
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="UserName"
                  aria-label="UserName"
                  name='username'
                  value={myUser.username}
                  onChange={handleUser}
                />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  aria-label="Email"
                  name='email'
                  value={myUser.email}
                  onChange={handleChange}
                />
              </div>
            
            </div>

            <div className="row g-3 mt-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location"
                  aria-label="location"
                  name='location'
                  value={profile.location}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contact"
                  aria-label="contact"
                  name='contact'
                  value={profile.contact}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pro_btns mt-2">
              <button type="submit" className="btn btn-primary">
                {update ? 'Updating...' : 'Update Profile'}
              </button>
              <button type="button" className="btn bg-black text-white" onClick={() => setShowModal(true)}>
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>

       {/* Custom Modal */}
       {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-header">
              <h5 className="custom-modal-title">Change Password</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="custom-modal-body">
              <form onSubmit={ handlePassword}>
                <div className="mb-3">
                  <label htmlFor="oldPassword" className="form-label">Old Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="oldPassword"
                    name='oldPassword'
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name='newPassword'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {status ? 'reseting...' : 'Update Password'}
              
                  </button>
                {message && <div className="alert alert-info mt-3">{message}</div>}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
