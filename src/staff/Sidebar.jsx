import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Badge
} from "@mui/material";
import {
  Dashboard,
  Restaurant,
  ShoppingCart,
  EventSeat,
  Star,
  Person,
  Logout,
  AdminPanelSettings,
  Menu as MenuIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../Context/AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#7f8c8d",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    body2: {
      fontWeight: 500,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: "4px 8px",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(25, 118, 210, 0.12)",
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.16)",
            },
          },
        },
      },
    },
  },
});

const drawerWidth = 280;

function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const {unreadUserNotifications, showUserNotifications, setShowUserNotifications} = useContext(AuthContext)

  const menuItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      path: "/staff/dashboard",
      color: "#1976d2",
    },
    {
      text: "Menu Items",
      icon: <Restaurant />,
      path: "/staff/dashboard/menu",
      color: "#ff9800",
    },
    {
      text: "Orders",
      icon: <ShoppingCart />,
      path: "/staff/dashboard/orders",
      color: "#4caf50",
    },
    {
      text: "Reservations",
      icon: <EventSeat />,
      path: "/staff/dashboard/reservations",
      color: "#9c27b0",
    },
    {
      text: "Menu Analytics",
      icon: <Star />,
      path: "/staff/dashboard/analytics",
      color: "#ff5722",
    },
    {
      text: "Profile",
      icon: <Person />,
      path: "/staff/dashboard/profile",
      color: "#607d8b",
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    navigate("/staff/dashboard/logout");
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Mobile Close Button */}
      {isMobile && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={handleDrawerToggle} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          mt: isMobile ? -1 : 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <Box display="flex" alignItems="center" gap={2} position="relative" zIndex={1}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <AdminPanelSettings />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Staff Panel
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Restaurant Management
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  "&.Mui-selected": {
                    background: `linear-gradient(90deg, ${item.color}15, ${item.color}08)`,
                    borderLeft: `3px solid ${item.color}`,
                    "& .MuiListItemIcon-root": {
                      color: item.color,
                    },
                    "& .MuiListItemText-primary": {
                      color: item.color,
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: location.pathname === item.path ? item.color : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="error"
                    sx={{
                      height: 20,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />

          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            />
          </ListItemButton>

        {/* Version Info */}
        <Box mt={2} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Version 2.1.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        {/* Mobile App Bar */}
        {isMobile && (
          <AppBar
            position="fixed"
            sx={{
              width: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              zIndex: muiTheme.zIndex.drawer + 1,
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                 Smookies
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Badge badgeContent={unreadUserNotifications} color="error" onClick={()=> setShowUserNotifications(!showUserNotifications)}>
                  <NotificationsIcon color="white" />
                </Badge>
              </Box>
            </Toolbar>
          </AppBar>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                border: "none",
                boxShadow: "0 0 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* Mobile Sidebar */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                border: "none",
                boxShadow: "0 0 20px rgba(0,0,0,0.1)",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
  
      </Box>
    </ThemeProvider>
  );
}

export default Sidebar;