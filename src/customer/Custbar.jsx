"use client"
import { Link, useLocation } from "react-router-dom"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  Restaurant as MenuIcon,
  ShoppingBag as OrderIcon,
  Person as ProfileIcon,
  EventSeat as ReservationIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from "@mui/icons-material"

const drawerWidth = 280

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/customer/dashboard",
    color: "#1976d2",
  },
  {
    text: "Menu",
    icon: <MenuIcon />,
    path: "/customer/dashboard/customermenuDisplay",
    color: "#388e3c",
  },
  {
    text: "Orders",
    icon: <OrderIcon />,
    path: "/customer/dashboard/customerOrder",
    color: "#f57c00",
  },
  {
    text: "Profile",
    icon: <ProfileIcon />,
    path: "/customer/dashboard/CustomerProfile",
    color: "#7b1fa2",
  },
  {
    text: "Reservations",
    icon: <ReservationIcon />,
    path: "/customer/dashboard/CustomerReservation",
    color: "#d32f2f",
  },
]

function Custbar({ mobileOpen = false, onMobileToggle }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header Section */}
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
        }}
      >
        {isMobile && (
          <IconButton
            onClick={onMobileToggle}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: "rgba(255,255,255,0.2)",
              mr: 2,
            }}
          >
            <ProfileIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Customer Portal
            </Typography>
          </Box>
        </Box>

        <Chip
          label="Premium Member"
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: 500,
          }}
        />
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path)

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={isMobile ? onMobileToggle : undefined}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    transition: "all 0.3s ease",
                    bgcolor: active ? `${item.color}15` : "transparent",
                    border: active ? `2px solid ${item.color}` : "2px solid transparent",
                    "&:hover": {
                      bgcolor: active ? `${item.color}20` : "rgba(0,0,0,0.04)",
                      transform: "translateX(4px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? item.color : "text.secondary",
                      minWidth: 40,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontWeight: active ? 600 : 500,
                        color: active ? item.color : "text.primary",
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                  {active && (
                    <Box
                      sx={{
                        width: 4,
                        height: 20,
                        bgcolor: item.color,
                        borderRadius: 2,
                        ml: 1,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* Footer Section */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/customer/dashboard/logout"
            onClick={isMobile ? onMobileToggle : undefined}
            sx={{
              borderRadius: 2,
              py: 1.5,
              px: 2,
              color: "error.main",
              "&:hover": {
                bgcolor: "error.light",
                color: "error.contrastText",
                transform: "translateX(4px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: 500,
                  fontSize: "0.95rem",
                },
              }}
            />
          </ListItemButton>
        </ListItem>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 2,
            color: "text.secondary",
            opacity: 0.7,
          }}
        >
          © 2024 Restaurant App
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop Drawer */
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "2px 0 12px rgba(0,0,0,0.08)",
              bgcolor: "background.paper",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  )
}

export default Custbar