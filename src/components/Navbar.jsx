import React, { useContext, useState } from 'react';
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
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Notifications from '../customer/Notifications';
import AllNotifications from '../customer/allnotifications';
import '../App.css';

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
  const { user, staff, customer, clicked, setClicked, total, showNotifications, handleDisplay, showNotificationsAll, notifyAll, setShowNotifications, setShowNotificationsAll } = useContext(AuthContext);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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

  const removeContent = () => {
    setClicked(true);
  };

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
      {user && customer && (
        <MenuItem>
          <IconButton 
            size="large" 
            aria-label="show items in cart" 
            color="inherit"
          >
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
      )}
  
      {user && staff && (
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show new notifications"
            color="inherit"
          >
            <Badge badgeContent={notifyAll.length} color="error" onClick={() => setShowNotificationsAll(!showNotificationsAll)}>
              <NotificationsIcon />
            </Badge>
            <div className="container-notify">
              {showNotificationsAll && <AllNotifications />}
            </div>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
      )}
  
      {user && customer && (
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show new notifications"
            color="inherit"
          >
            <Link to='/customer/dashboard/notify'>
            <Badge badgeContent={notifyAll.length} color="error" onClick={() => setShowNotifications(!showNotifications)}>
              <NotificationsIcon />
            </Badge>
            </Link>
            <div className="container-notify">
              {showNotifications && <Notifications />}
            </div>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
      )}

      {!user && (
         <MenuItem>
               <div className="mobile_links">
                <Link to='/login'>Login</Link>
                <Link to='/signup'>SignUp</Link>
              </div>
       </MenuItem>
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {user && (staff || customer) && (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <MenuIcon onClick={handleDisplay} />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                <Link to={staff ? '/staff/dashboard' : '/customer/dashboard'} className='text-white'>Dashboard</Link>
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {customer && (
                  <IconButton
                    size="large"
                    aria-label="show items in cart"
                    color="inherit"
                  >
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
                )}
                <IconButton
                  size="large"
                  aria-label="show new notifications"
                  color="inherit"
                >
                  {staff && (
                    <Badge badgeContent={notifyAll.length} color="error" onClick={() => setShowNotificationsAll(!showNotificationsAll)}>
                      <NotificationsIcon />
                    </Badge>
                  )}
                  {customer && (
                    <Badge badgeContent={notifyAll.length} color="error" onClick={() => setShowNotifications(!showNotifications)}>
                      <NotificationsIcon />
                    </Badge>
                  )}
                  <div className="container-notify">
                    {staff && showNotificationsAll && <AllNotifications />}
                    {customer && showNotifications && <Notifications />}
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
                  <Link to={staff ? '/staff/dashboard/profile' : '/customer/dashboard/CustomerProfile'} className='text-white'>
                    <AccountCircle />
                  </Link>
                </IconButton>
              </Box>
            </>
          )}

          {!user && (
            <>
              <div className="link">
                <Link to='/' className='text-white'>Smark</Link>
              </div>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <div className="links">
                <Link to='/login'>Login</Link>
                <Link to='/signup'>SignUp</Link>
              </div>
            </>
          )}

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

export default Bar;
