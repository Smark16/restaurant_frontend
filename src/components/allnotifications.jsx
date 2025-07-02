import React, { useContext, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Badge,
  Divider,
  Button,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Fade,
  Stack,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Restaurant as RestaurantIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  MoreVert as MoreVertIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  Clear as ClearAllIcon,
} from "@mui/icons-material";
import { AuthContext } from "../Context/AuthContext";

function NotificationsPanel() {
  const { showNotificationsAll, orderNotify } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [filter, setFilter] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Validate orderNotify is an array
  const notifications = Array.isArray(orderNotify) ? orderNotify : [];

  // Enhanced notifications with additional properties
  const enhancedNotifications = notifications.map((notify) => ({
    ...notify,
    type: getNotificationType(notify.message || ""),
    read: notify.read ?? Math.random() > 0.5, // Fallback to random if read status not provided
    priority: getNotificationPriority(notify.message || ""),
  }));

  function getNotificationType(message) {
    if (!message) return "info";
    message = message.toLowerCase();
    if (message.includes("order")) return "order";
    if (message.includes("reservation")) return "reservation";
    if (message.includes("payment")) return "payment";
    if (message.includes("error") || message.includes("failed")) return "error";
    if (message.includes("warning")) return "warning";
    return "info";
  }

  function getNotificationPriority(message) {
    if (!message) return "low";
    message = message.toLowerCase();
    if (message.includes("urgent") || message.includes("error")) return "high";
    if (message.includes("important") || message.includes("payment")) return "medium";
    return "low";
  }

  const getNotificationIcon = (type) => {
    const iconProps = { fontSize: "small" };
    switch (type) {
      case "order":
        return <RestaurantIcon {...iconProps} />;
      case "reservation":
        return <ScheduleIcon {...iconProps} />;
      case "payment":
        return <CheckCircleIcon {...iconProps} />;
      case "error":
        return <ErrorIcon {...iconProps} />;
      case "warning":
        return <WarningIcon {...iconProps} />;
      default:
        return <InfoIcon {...iconProps} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "order":
        return "primary";
      case "reservation":
        return "secondary";
      case "payment":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      default:
        return "#4caf50";
    }
  };

  const filteredNotifications = enhancedNotifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const unreadCount = enhancedNotifications.filter((n) => !n.read).length;

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (!showNotificationsAll) {
    return null;
  }

  return (
    <Fade in={showNotificationsAll}>
      <Box
        sx={{
          position: "fixed",
          top: 80,
          right: 20,
          width: { xs: "calc(100vw - 40px)", sm: 400 },
          maxHeight: "80vh",
          zIndex: 1300,
          boxShadow: theme.shadows[8],
        }}
      >
        <Card sx={{ maxHeight: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <CardContent sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon color="primary" />
                </Badge>
                <Typography variant="h6" fontWeight="bold">
                  Notifications
                </Typography>
              </Box>
              <IconButton size="small" color="primary">
                <ClearAllIcon />
              </IconButton>
            </Box>

            {/* Filter Chips */}
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                label="All"
                variant={filter === "all" ? "filled" : "outlined"}
                color="primary"
                size="small"
                onClick={() => setFilter("all")}
                sx={{ cursor: "pointer" }}
              />
              <Chip
                label={`Unread (${unreadCount})`}
                variant={filter === "unread" ? "filled" : "outlined"}
                color="error"
                size="small"
                onClick={() => setFilter("unread")}
                sx={{ cursor: "pointer" }}
              />
              <Chip
                label="Read"
                variant={filter === "read" ? "filled" : "outlined"}
                color="success"
                size="small"
                onClick={() => setFilter("read")}
                sx={{ cursor: "pointer" }}
              />
            </Stack>
          </CardContent>

          <Divider />

          {/* Notifications List */}
          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            {filteredNotifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <NotificationsIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No notifications to show
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filter === "unread" ? "All caught up!" : "Check back later for updates"}
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {filteredNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      sx={{
                        bgcolor: notification.read ? "transparent" : "action.hover",
                        borderLeft: `4px solid ${getPriorityColor(notification.priority || "low")}`,
                        "&:hover": {
                          bgcolor: "action.selected",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: `${getNotificationColor(notification.type || "info")}.main`,
                            width: 40,
                            height: 40,
                          }}
                        >
                          {getNotificationIcon(notification.type || "info")}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: notification.read ? "normal" : "bold",
                                flexGrow: 1,
                                lineHeight: 1.4,
                              }}
                            >
                              {notification.message || "No message"}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, notification)}
                              sx={{ opacity: 0.7 }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                            <Chip
                              label={notification.type || "info"}
                              size="small"
                              color={getNotificationColor(notification.type || "info")}
                              variant="outlined"
                              sx={{ fontSize: "0.7rem", height: "20px" }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(notification.message_date)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < filteredNotifications.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <>
              <Divider />
              <CardContent sx={{ pt: 2, pb: 2 }}>
                <Button fullWidth variant="outlined" size="small" startIcon={<MarkReadIcon />}>
                  Mark All as Read
                </Button>
              </CardContent>
            </>
          )}
        </Card>

        {/* Context Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>
            <MarkReadIcon sx={{ mr: 1 }} fontSize="small" />
            Mark as {selectedNotification?.read ? "Unread" : "Read"}
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </Fade>
  );
}

export default NotificationsPanel;