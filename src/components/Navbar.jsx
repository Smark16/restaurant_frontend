import React, {useContext, useState} from 'react'
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Link} from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Notifications from '../customer/Notifications';
import '../App.css'
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
      }));
      
      const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }));
      
      const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('md')]: {
            width: '20ch',
          },
        },
      }));
      
      function Bar() {
        const [anchorEl, setAnchorEl] = useState(null);
        const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
        const {user, staff, customer, clicked, setClicked, total, handleMessages,showNotifications, orderNotify} = useContext(AuthContext)
        
        const isMenuOpen = Boolean(anchorEl);
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
      
        const handleProfileMenuOpen = (event) => {
          setAnchorEl(event.currentTarget);
        };
      
        const handleMobileMenuClose = () => {
          setMobileMoreAnchorEl(null);
        };
      
        const handleMenuClose = () => {
          setAnchorEl(null);
          handleMobileMenuClose();
        };
      
        const handleMobileMenuOpen = (event) => {
          setMobileMoreAnchorEl(event.currentTarget);
        };

        const removeContent = ()=>{
          setClicked(true)
        }
   
      
        const menuId = 'primary-search-account-menu';
        const renderMenu = (
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
          </Menu>
        );
      
        const mobileMenuId = 'primary-search-account-menu-mobile';
        const renderMobileMenu = (
          <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
          >
            <MenuItem>
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Link to='/customer/dashboard/cart' className='text-black'>
                    {clicked ? (
                      <Badge>
                        <ShoppingCartIcon />
                      </Badge>
                    ) : (
                      <Badge badgeContent={total} color="error" onClick={removeContent}>
                        <ShoppingCartIcon />
                      </Badge>
                    )}
              </Link>
              </IconButton>
              <p>Cart</p>
            </MenuItem>
            <MenuItem>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                {/* notifications */}
                <Badge badgeContent={orderNotify.length} color="error" onClick={handleMessages}>
                    <NotificationsIcon />
                    </Badge>
                    <div className="container-notify">
                      {showNotifications && (<Notifications/>)}
                      </div>
              </IconButton>
              <p>Notifications</p>
            </MenuItem>

            {/* profile */}
            <Link to='/customer/dashboard/CustomerProfile' className='text-black'>
            <MenuItem>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                color="inherit"
              >
              <AccountCircle />
              </IconButton>
              <p>Profile</p>
            </MenuItem>
            </Link>
          </Menu>
        );
      
        return (
          <Box sx={{ flexGrow: 1 }} className='box'>
            <AppBar position="static">
              <Toolbar>
                {user && staff && (<>
                  <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon/>
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  <Link to='/staff/dashboard' className='text-white'>DashBoard</Link>
                 
                </Typography>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                  >
                    <Badge badgeContent={orderNotify.length} color="error" onClick={handleMessages}>
                    <NotificationsIcon />
                    </Badge>
                    <div className="container-notify">
                      {showNotifications && (<Notifications/>)}
                      </div>
                  </IconButton>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <Link to='/staff/dashboard/profile' className='text-white'>
                    <AccountCircle />
                    </Link>
                  </IconButton>
                </Box>
                </>)}

                {user && customer && (<>
                  <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  <div className="link">
                   <Link to='/customer/dashboard'>DashBoard</Link>
                  </div>
                
                </Typography>
             
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                     <Link to='/customer/dashboard/cart' className='text-white'>
                    {clicked ? (
                      <Badge>
                        <ShoppingCartIcon />
                      </Badge>
                    ) : (
                      <Badge badgeContent={total} color="error" onClick={removeContent}>
                        <ShoppingCartIcon />
                      </Badge>
                    )}
      </Link>
                  </IconButton>
                  <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                  >
                   
                    <Badge badgeContent={orderNotify.length} color="error" onClick={handleMessages}>
                    <NotificationsIcon />
                    </Badge>
                    <div className="container-notify">
                      {showNotifications && (<Notifications/>)}
                      </div>
                  </IconButton>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    color="inherit"
                  >
                     <Link to='/customer/dashboard/CustomerProfile' className='text-white'>
                    <AccountCircle />
                    </Link>
                  </IconButton>
                </Box>
               
                </>)}
               

                {!user && (<>
                  <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  <div className="link">
                   <Link to='/'>Smark</Link>
                  </div>
                
                </Typography>
             
                <Box sx={{ flexGrow: 1 }} />
               
                 <div className="links">
                 <Link to='/login'>Login</Link>
                <Link to='/signup'>SignUp</Link>
                 </div>
                </>)}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                </Box>
              </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
          </Box>
        );
      }
         
export default Bar
