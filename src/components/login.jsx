{/* <script src="http://localhost:8097"></script> */}
import React, {useState, useContext} from 'react'
import { AuthContext } from '../Context/AuthContext';
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

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const {loginUser} = useContext(AuthContext)
    const [user, setUser] = useState({username:"", password:""})

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleChange =(e)=>{
        const {name, value} = e.target
        setUser({...user, [name]:value})
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(loginUser){
          const username = user.username
          const password = user.password
          loginUser(username, password)
        }
    }
  return (
    <>
      <div className='mt-5 text-center container-fluid loginForm'>

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
      variant="outlined" 
      name='username'
      value={user.username}
      onChange={handleChange}/>

        </div>
      
      {/* password */}
      <div className='mt-4'>
      <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            label="Password"
            name='password'
            value={user.password}
            onChange={handleChange}
          />
      </div>
         
         <Button className='mt-3' variant='contained' type='submit' onClick={handleSubmit}>LOGIN</Button>
        </form>
         
         <p className='text-center w-100'>forgot Password ? <Link to='/forgot-password'>Reset Password</Link></p>
        <p className='text-center w-100'>No account? <Link to='/signup'>Create one</Link></p>
       
    </Box>
 </div>
    </>
  )
}

export default Login
