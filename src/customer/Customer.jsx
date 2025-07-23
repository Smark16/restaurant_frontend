"use client"

import React, { useContext, useEffect, useState } from "react"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  LinearProgress,
  Divider,
  useTheme,
  alpha,
  Badge
} from "@mui/material"
import {
  TrendingUp,
  Restaurant,
  EventSeat,
  AccountBalanceWallet,
  CheckCircle,
  Cancel,
  Schedule,
  Visibility,
  ArrowForward,
  CalendarToday,
  Phone,
  LocationOn,
  People,
  Notifications as NotificationsIcon,
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from '../Context/AuthContext'
import Calendar from "./calendar"
import NotificationsPanel from "./UserNotifications"

import '../App.css'

// Stats Card Component
const StatsCard = ({ title, value, icon, color, trend, subtitle }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${alpha(color, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>{icon}</Avatar>
        </Box>
        {trend && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <TrendingUp sx={{ fontSize: 16, color: "success.main", mr: 0.5 }} />
            <Typography variant="caption" color="success.main">
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

// Status Chip Component
const StatusChip = ({ status }) => {
  const getStatusProps = (status) => {
    switch (status) {
      case "Completed":
      case "Accepted":
        return { color: "success", icon: <CheckCircle sx={{ fontSize: 16 }} /> }
      case "Canceled":
      case "Rejected":
        return { color: "error", icon: <Cancel sx={{ fontSize: 16 }} /> }
      case "In Progress":
      case "Pending":
        return { color: "warning", icon: <Schedule sx={{ fontSize: 16 }} /> }
      default:
        return { color: "default", icon: null }
    }
  }

  const { color, icon } = getStatusProps(status)

  return (
    <Chip
      label={status === "Accepted" ? "Confirmed" : status}
      color={color}
      size="small"
      icon={icon}
      sx={{ fontWeight: 500 }}
    />
  )
}

function Customer() {
  const { user, Loginloading, unreadUserNotifications, showUserNotifications, setShowUserNotifications } = useContext(AuthContext)

  console.log('bool', showUserNotifications)
  const theme = useTheme()

  const [expense, setExpense] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [reservations, setReservations] = useState([])

  // API endpoints
  const user_order = `https://restaurant-backend5.onrender.com/orders/userOrder/${user?.user_id}`
  const userReservation = `https://restaurant-backend5.onrender.com/reservations/user-reservation/${user?.user_id}`
  const total_expense = `https://restaurant-backend5.onrender.com/dashboard/user_expense/${user?.user_id}`

  // get user orders
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(user_order)
      setOrders(response.data)
    } catch (err) {
      console.log("Error occurred", err)
    } finally {
      setLoading(false)
    }
  }

  // get user reservations
  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await axios.get(userReservation)
      setReservations(response.data)
    } catch (err) {
      console.log("Error occurred", err)
    } finally {
      setLoading(false)
    }
  }

  // get total Expense
  const totalExpense = async () => {
    try {
      const response = await axios.get(total_expense)
      setExpense(response.data)
    } catch (err) {
      console.log('err', err)
    }
  }


  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchData(), fetchReservations()])
    }
    loadData()
    totalExpense()
  }, [])

  if (Loginloading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading your dashboard...
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          display: {xs:"none", sm:"flex"},
          alignItems: "center",
          justifyContent: "flex-end",
          flexGrow: 1,
          gap: 1,
        }}

        className='notify_icon'
      >
        <IconButton onClick={() => setShowUserNotifications(!showUserNotifications)}>
          <Badge badgeContent={unreadUserNotifications} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>


      {showUserNotifications && <NotificationsPanel />}

      <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
        <Card sx={{ mb: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Welcome back, {user.username}!
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Here's what's happening with your account today.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Reservations"
              value={reservations.length}
              icon={<EventSeat />}
              color={theme.palette.primary.main}
              trend="+12% from last month"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Expense"
              value={`UGX ${expense.Total_expense || 0}`}
              icon={<TrendingUp />}
              color={theme.palette.success.main}
              subtitle="This month"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Orders"
              value={orders.length}
              icon={<Restaurant />}
              color={theme.palette.warning.main}
              trend="+8% from last week"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Wallet Balance"
              value="UGX 0.00"
              icon={<AccountBalanceWallet />}
              color={theme.palette.info.main}
              subtitle="Available balance"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Orders */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: "fit-content" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Recent Orders
                  </Typography>
                  <Button component={Link} to="/customer/dashboard/customerOrder" endIcon={<ArrowForward />} size="small">
                    View All
                  </Button>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : orders.length === 0 ? (
                  <Alert severity="info" sx={{ textAlign: "center" }}>
                    No orders found. Start by placing your first order!
                  </Alert>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Contact</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.slice(0, 5).map((order) => (
                          <TableRow key={order.id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                #{order.id}
                              </Typography>
                            </TableCell>
                            <TableCell>{order.user.username}</TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <LocationOn sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                                {order.location}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Phone sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                                {order.contact}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <StatusChip status={order.status} />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(order.order_date).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>

            {/* Recent Reservations */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                  Recent Reservations
                </Typography>

                {loading ? (
                  <LinearProgress sx={{ my: 2 }} />
                ) : reservations.length === 0 ? (
                  <Alert severity="info">No reservations found. Make your first reservation today!</Alert>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Table</TableCell>
                          <TableCell>Contact</TableCell>
                          <TableCell>Party Size</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reservations.slice(0, 5).map((reservation) => (
                          <TableRow key={reservation.id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                #{reservation.id}
                              </Typography>
                            </TableCell>
                            <TableCell>{reservation.user.username}</TableCell>
                            <TableCell>
                              <Chip label={`Table ${reservation.table}`} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Phone sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                                {reservation.contact}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <People sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                                {reservation.party_size} people
                              </Box>
                            </TableCell>
                            <TableCell>
                              <StatusChip status={reservation.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Calendar */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" fontWeight="bold">
                    Calendar
                  </Typography>
                </Box>
                <Calendar />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quick Overview
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Completed Orders
                  </Typography>
                  <Chip
                    label={orders.filter((order) => order.status === "Completed").length}
                    color="success"
                    size="small"
                  />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Pending Orders
                  </Typography>
                  <Chip
                    label={orders.filter((order) => order.status === "Pending").length}
                    color="warning"
                    size="small"
                  />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Confirmed Reservations
                  </Typography>
                  <Chip
                    label={reservations.filter((res) => res.status === "Accepted").length}
                    color="primary"
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Member since
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {user.date_joined}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>

  )
}

export default Customer