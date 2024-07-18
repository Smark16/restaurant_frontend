import React, { useContext, useEffect, useState } from 'react';
import '../staff/staff.css';
import { AuthContext } from '../Context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProfileUrl = 'http://127.0.0.1:8000/restaurant/profiles';

function Profile() {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState('');
  const [profileImage, setProfileImage] = useState([]);
  const [profile, setProfile] = useState({ full_name: "", email: "", location: "", contact: "", gender: "", image: null });
  const [myUser, setMyUser] = useState({ username: "", is_staff: "", is_customer: "" });
  const [error, setError] = useState('');

  const updateProfileUrl = `http://127.0.0.1:8000/restaurant/update_profile/${user.user_id}`;
  const url = `http://127.0.0.1:8000/restaurant/profile/${user.user_id}`;
  const updateUsernameUrl = 'http://127.0.0.1:8000/restaurant/update-username';
  const userUrl = `http://127.0.0.1:8000/restaurant/single_user/${user.user_id}`;

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
      const response = await axios.get(userUrl);
      const data = response.data;
      setMyUser([...profile, data]);
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

  const handleGender = (e) => {
    const gender = e.target.value;
    setProfile({ ...profile, gender });
  };

  const handleUser = (e) => {
    const { name, value } = e.target;
    setMyUser({ ...myUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('full_name', profile.full_name);
    formData.append('email', profile.email);
    formData.append('location', profile.location);
    formData.append('contact', profile.contact);
    formData.append('gender', profile.gender);
  
    // Only append the image if it has been changed
    if (profile.image && typeof profile.image !== 'string') {
      formData.append('image', profile.image);
    }
  
    try {
      await axios.put(updateProfileUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const userdata = { username: myUser.username };
      await axios.put(updateUsernameUrl, userdata);
      setError('');
      await profileData();
      await fetchUser();
    } catch (error) {
      setError('Try Refreshing The page so that you updates are displayed');
      console.log("there was a", error);
    }
  };

  useEffect(() => {
    fetchProfiles();
    profileData();
    fetchUser();
    if (user.is_staff) {
      setStatus(true);
    } else {
      setStatus(false);
    }
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
              <span>Status: {status ? 'Staff' : 'Customer'}</span>
            </div>
            <div>
              <span>FullName: {user.full_name}</span>
            </div>
            <div>
              <span>Username: {user.username}</span>
            </div>
            <div>
              <span>Email: {user.email}</span>
            </div>
            <div>
              <span>Contact: {user.contact}</span>
            </div>
            <div>
              <span>Gender: {user.gender}</span>
            </div>
            <div>
              <span>Location: {user.location}</span>
            </div>
          </div>
          <form className='mt-3 p-3 col-md-8' onSubmit={handleSubmit}>
            <h5 className='text-center'>Edit Profile</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row g-3 mt-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  aria-label="Full Name"
                  name='full_name'
                  value={profile.full_name}
                  onChange={handleChange}
                />
              </div>
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
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <select className="form-control" value={profile.gender} onChange={handleGender}>
                  <option value="">Choose Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
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

            <div className="row g-3 mt-3">
              <div className="col">
                {/* <Link to='/staff/dashboard/password_reset'>
                  <button type="button" className='bg-dark text-center text-white'>Reset Password</button>
                </Link> */}
              </div>
              <div className="col">
                <button className='bg-primary text-center text-white' type='submit'>Save Profile</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;
