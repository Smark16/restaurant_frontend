// components/NavigationBar.js
import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Settings as SettingsIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { AuthContext } from "../Context/AuthContext";
import NotificationsPanel from "../customer/UserNotifications";
import { Link } from "react-router-dom";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  backdropFilter: "blur(10px)",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: "70px",
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(0, 3),
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.5rem",
  background: "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    transform: "translateY(-2px)",
  },
}));

const AuthButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const NavigationBar = ({ onMenuToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout, unreadUserNotifications, showUserNotifications, setShowUserNotifications} = useContext(AuthContext);

  // State management
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  // Event handlers
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const renderProfileMenu = () => (
    <Menu
      anchorEl={profileMenuAnchor}
      open={Boolean(profileMenuAnchor)}
      onClose={handleProfileMenuClose}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200,
          borderRadius: 2,
          boxShadow: theme.shadows[8],
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {user && user.name ? user.name : "User"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user && user.email ? user.email : "user@example.com"}
        </Typography>
      </Box>
      <Divider />
     
      <Divider />
      <MenuItem
        onClick={() => {
          handleProfileMenuClose();
          logout();
        }}
      >
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = () => (
    <Menu
      anchorEl={mobileMenuAnchor}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200,
          borderRadius: 2,
          boxShadow: theme.shadows[8],
        },
      }}
    >
     
      {user && (
        <MenuItem onClick={handleMobileMenuClose}>
          <ListItemIcon>
            <Badge badgeContent={unreadUserNotifications} color="error">
              <NotificationsIcon />
            </Badge>
          </ListItemIcon>
          Notifications
        </MenuItem>
      )}
      {!user && (
        <>
        <Link to='/login' className="text-black">
          <MenuItem onClick={handleMobileMenuClose}>
            <ListItemText primary="Login"/>
          </MenuItem>
        </Link>

        <Link to='/signup' className="text-black">
          <MenuItem onClick={handleMobileMenuClose} >
            <ListItemText primary="Sign Up"/>
          </MenuItem>
        </Link>
        </>
      )}
    </Menu>
  );

  return (
    <>
      <StyledAppBar position="static" elevation={0}>
        <StyledToolbar>
          {user && (
            <>
            <StyledIconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </StyledIconButton>

              <Logo variant="h6" component="div">
              Smookies
              </Logo>
            </>
          )}

         {!user && (
          <Link to='/' className="text-white">
          <Logo variant="h6" component="div">
            Smookies
          </Logo>
          </Link>
         )}

          <Box sx={{ flexGrow: 1 }} />

          {user ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Desktop Actions */}
              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                
                <Tooltip title="Notifications">
                  <StyledIconButton color="inherit" onClick={()=> setShowUserNotifications(!showUserNotifications)}>
                    <Badge badgeContent={unreadUserNotifications} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </StyledIconButton>
                </Tooltip>

                <Tooltip title="Profile">
                  <StyledIconButton color="inherit" onClick={handleProfileMenuOpen}>
                    <Avatar sx={{ width: 32, height: 32 }} src={user && user.avatar} alt={user && user.name}>
                      {user && user.name ? user.name.charAt(0) : "U"}
                    </Avatar>
                  </StyledIconButton>
                </Tooltip>
              </Box>

              {/* Mobile Menu Button */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <StyledIconButton color="inherit" onClick={handleMobileMenuOpen}>
                  <MoreVertIcon />
                </StyledIconButton>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>

                <Link to='/login' className="text-white">
                <AuthButton variant="outlined" color="inherit">
                  Login
                </AuthButton>
                </Link>
               
               <Link to='/signup' className="text-white">
                <AuthButton variant="contained" color="secondary">
                  Sign Up
                </AuthButton>
               </Link>
              </Box>
              <Box sx={{ display: { xs: "flex", sm: "none" } }}>
                <StyledIconButton color="inherit" onClick={handleMobileMenuOpen}>
                  <MoreVertIcon />
                </StyledIconButton>
              </Box>
            </Box>
          )}
        </StyledToolbar>
      </StyledAppBar>

      {/* Menus */}
      {showUserNotifications && <NotificationsPanel/> }
      {renderProfileMenu()}
      {renderMobileMenu()}
    </>
  );
};

export default NavigationBar;