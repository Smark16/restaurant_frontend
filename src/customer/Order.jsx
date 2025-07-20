"use client"

import React, { useContext, useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  useTheme,
  alpha,
  Tooltip,
  Fade,
  Alert,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
} from "@mui/material"
import {
  Delete,
  CheckCircle,
  Cancel,
  Schedule,
  LocationOn,
  Phone,
  CalendarToday,
  Visibility,
  ShoppingBag,
  FilterList,
  Refresh,
} from "@mui/icons-material"

import axios from 'axios'
import { AuthContext } from "../Context/AuthContext"
import useAxios from "../components/useAxios"

import { IndexedData } from "../components/IndexedDB"

// Order Card Component for Mobile
const OrderCard = ({ order, onDelete }) => {
  const theme = useTheme()

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success"
      case "Canceled":
        return "error"
      case "In Progress":
        return "warning"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle />
      case "Canceled":
        return <Cancel />
      case "In Progress":
        return <Schedule />
      default:
        return <Schedule />
    }
  }

  return (
    <Fade in timeout={100}>
      <Card
        sx={{
          mb: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.1)}`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Order #{order.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(order.order_date).toLocaleDateString()}
              </Typography>
            </Box>
            <Chip
              icon={getStatusIcon(order.status)}
              label={order.status === "In Progress" ? "Pending" : order.status}
              color={getStatusColor(order.status)}
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {order.location}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {order.contact}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarToday sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(order.order_date).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           
            <Tooltip title="Delete Order">
              <IconButton
                onClick={() => onDelete(order.id)}
                color="error"
                sx={{
                  "&:hover": {
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  )
}

// Empty State Component
const EmptyState = () => {
  const theme = useTheme()

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: "center",
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
          theme.palette.secondary.main,
          0.05,
        )} 100%)`,
      }}
    >
      <ShoppingBag sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        No Orders Yet
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        You haven't placed any orders yet. Start browsing our menu to place your first order!
      </Typography>
      <Button variant="contained" size="large" sx={{ mt: 2 }}>
        Browse Menu
      </Button>
    </Paper>
  )
}

// Loading Skeleton Component
const OrderSkeleton = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Skeleton variant="text" width={120} height={32} />
        <Skeleton variant="rectangular" width={80} height={24} />
      </Box>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Skeleton variant="rectangular" width={100} height={32} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
    </CardContent>
  </Card>
)

function EnhancedOrder() {
  const { user } = useContext(AuthContext)
  const {getUserOrders } = IndexedData()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const axiosInstance = useAxios()

  const user_orders = `https://restaurant-backend5.onrender.com/orders/userOrder/${user?.user_id}`

  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // get offline user orders
  useEffect(()=>{
    getUserOrders(user?.user_id)
    .then(data => setOrders(data))
    .catch(err => console.log('err', err))
  }, [user?.user_id])

  // get user orders
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(user_orders)
      
      setOrders(response.data)
      setLoading(false)
    } catch (err) {
      console.log("Error occurred", err)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const delete_order = `https://restaurant-backend5.onrender.com/orders/delete_order/${id}`
      const deleteResponse = await axiosInstance.delete(delete_order)
      // Mock API call
      const deleted = orders.filter((order) => order.id !== id)
      setOrders(deleted)

      if(deleteResponse.status === 204){
        setSnackbarMessage("Order deleted successfully")
      }
      setSnackbarOpen(true)
      setDeleteDialogOpen(false)
      setOrderToDelete(null)
    } catch (err) {
      console.log("Error deleting order", err)
      setSnackbarMessage("Failed to delete order")
      setSnackbarOpen(true)
    }
  }

  const openDeleteDialog = (id) => {
    setOrderToDelete(id)
    setDeleteDialogOpen(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success"
      case "Canceled":
        return "error"
      case "In Progress":
        return "warning"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle />
      case "Canceled":
        return <Cancel />
      case "In Progress":
        return <Schedule />
      default:
        return <Schedule />
    }
  }

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((order) => order.status === filterStatus)
  
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: 3,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Your Orders
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Track and manage all your placed orders
            </Typography>
          </Box>
        </Paper>

        {/* Stats and Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {orders.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {orders.filter((o) => o.status === "Completed").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {orders.filter((o) => o.status === "In Progress").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  {orders.filter((o) => o.status === "Canceled").length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Canceled
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter and Actions */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FilterList color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Filter Orders
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {["all", "Completed", "In Progress", "Canceled"].map((status) => (
                  <Chip
                    key={status}
                    label={status === "all" ? "All" : status}
                    onClick={() => setFilterStatus(status)}
                    color={filterStatus === status ? "primary" : "default"}
                    variant={filterStatus === status ? "filled" : "outlined"}
                  />
                ))}
              </Box>
            </Box>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchData}>
              Refresh
            </Button>
          </Box>
        </Paper>

        {/* Orders Content */}
        {loading ? (
          <Box>
            {Array.from({ length: 3 }).map((_, index) => (
              <OrderSkeleton key={index} />
            ))}
          </Box>
        ) : filteredOrders.length === 0 ? (
          <EmptyState />
        ) : isMobile ? (
          // Mobile Card View
          <Box>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} onDelete={openDeleteDialog} />
            ))}
          </Box>
        ) : (
          // Desktop Table View
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
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
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status === "In Progress" ? "Pending" : order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.order_date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Delete Order">
                          <IconButton size="small" color="error" onClick={() => openDeleteDialog(order.id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this order? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => orderToDelete && handleDelete(orderToDelete)}
            color="error"
            variant="contained"
            startIcon={<Delete />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default EnhancedOrder