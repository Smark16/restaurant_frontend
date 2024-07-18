import React, {useState, useContext} from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../Context/AuthContext';


function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const {loginUser, Loginloading, noActive} = useContext(AuthContext)
    const [user, setUser] = useState({username:"", password:""})
    const [loader, setLoader] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    
    const handleChange =(e)=>{
      const {name, value} = e.target
      setUser({...user, [name]:value})
  }

  const handleSubmit = (e)=>{
    setLoader(false)
      e.preventDefault()
      if(loginUser){
        const username = user.username
        const password = user.password
        loginUser(username, password)
      }
      setLoader(true)
  }

  return (
    <>
     <div className='text-center container-fluid loginForm'>
      <div className="grow_img">
      <p>Welcome back! 👋</p>
      {noActive && <p className='alert alert-warning'>{noActive}</p>}
      </div>
   
<Box
component="form"
sx={{
'& > :not(style)': { m: 1, width: '25ch' },
}}
noValidate
autoComplete="off"
>
 <form className='text-center w-100'>
 <div className='mt-3'>   
<TextField 
id="outlined-basic" 
label="username" 
InputProps={{
startAdornment: (
  <InputAdornment position="start">
    <AccountCircle />
  </InputAdornment>
),
}}
fullWidth
variant="outlined" 
name='username'
value={user.username}
onChange={handleChange}/>

</div>

{/* password */}
<div className='mt-4'>
<OutlinedInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        startAdornment={
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        }
                        fullWidth
                        margin="normal"
                        placeholder="Password"
                    />
</div>
 <button 
 className='mt-3 login_btn w-100 btn btn-primary p-2 text-white' 
 type='submit' 
 onClick={handleSubmit}>
  {loader ? 'Loading...' : 'Login'}
</button>
</form>
 
 {/* <p className='text-center w-100'>forgot Password ? <Link to='/forgot-password'>Reset Password</Link></p> */}
<p className='text-center w-100'>No account? <Link to='/register'>Create one</Link></p>

</Box>
</div>
    </>
  )
}

export default Login
