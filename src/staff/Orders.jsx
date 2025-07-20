import { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Avatar,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  HourglassEmpty as HourglassIcon,
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import axios from "axios";
import useAxios from "../components/useAxios";
import { AuthContext } from "../Context/AuthContext";

const orderUrl = "https://restaurant-backend5.onrender.com/orders/user_orders";

function OrdersManagement() {
  const { authTokens } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(orderUrl);
      // Validate response data
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format: Expected an array of orders");
      }
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://restaurant-backend5.onrender.com/orders/delete_order/${id}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    } catch (err) {
      console.error("Error deleting order:", err);
      setError(err.response?.data?.message || "Failed to delete order. Please try again.");
    }
  };

  const changeStatus = async (id, newStatus) => {
    if (!authTokens) {
      setError("You must be logged in to update order status.");
      return;
    }
    try {
      await axiosInstance.patch(`https://restaurant-backend5.onrender.com/orders/update_status/${id}`, {
        newStatus,
      });
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === id ? { ...order, status: newStatus } : order)));
      setStatusMenuAnchor(null);
      setSelectedOrderForStatus(null);
    } catch (err) {
      console.error("Error changing status:", err);
      setError(err.response?.data?.message || "Failed to update order status. Please try again.");
    }
  };

  const showOrderDetails = async (order) => {
    if (!order?.id) {
      setError("Invalid order data: Missing user information.");
      return;
    }
    setSelectedOrder(order);
    setShowModal(true);
    setItemsLoading(true);

    const SingleOrderItemUrl = `https://restaurant-backend5.onrender.com/orders/single_order_item/${order?.id}`;

    try {
      const response = await axios.get(SingleOrderItemUrl);
      const data = response.data;
      
      setOrderItems(data?.takenItems);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError(err.message || "Failed to load order details.");
    } finally {
      setItemsLoading(false);
    }
  };

  console.log('order_items', orderItems)
  const getStatusChip = (status) => {
    const statusConfig = {
      Completed: { color: "success", icon: <CheckCircleIcon />, label: "Completed" },
      Canceled: { color: "error", icon: <CancelIcon />, label: "Canceled" },
      "In Progress": { color: "warning", icon: <ScheduleIcon />, label: "In Progress" },
      Pending: { color: "warning", icon: <ScheduleIcon />, label: "Pending" },
      "": { color: "default", icon: <HourglassIcon />, label: "Waiting" },
    };

    const config = statusConfig[status || ""] || statusConfig[""];

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        variant="outlined"
        size="small"
        sx={{ fontWeight: "bold" }}
      />
    );
  };

  const handleStatusMenuOpen = (event, order) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedOrderForStatus(order);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
    setSelectedOrderForStatus(null);
  };

  const filteredOrders = orders.filter((order) => {
    const username = order.user?.username ? order.user.username.toLowerCase() : "";
    const location = order.location ? order.location.toLowerCase() : "";
    const contact = order.contact ? order.contact.toString() : "";
    const status = order.status ? order.status.toLowerCase() : "";
    const search = searchText.toLowerCase();
    return username.includes(search) || location.includes(search) || contact.includes(search) || status.includes(search);
  });

  const columns = [
    {
      field: "username",
      headerName: "Customer",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
            <PersonIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {params.row.user?.username || "Unknown"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "order_date",
      headerName: "Date",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.value ? new Date(params.value).toLocaleDateString() : "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value || "N/A"}</Typography>
        </Box>
      ),
    },
    {
      field: "contact",
      headerName: "Contact",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PhoneIcon fontSize="small" color="action" />
          <Typography variant="body2">{params.value || "N/A"}</Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<VisibilityIcon />}
          label="View Details"
          onClick={() => showOrderDetails(params.row)}
          color="primary"
        />,
        <GridActionsCellItem
          key="status"
          icon={<EditIcon />}
          label="Change Status"
          onClick={(event) => handleStatusMenuOpen(event, params.row)}
          color="secondary"
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {
            setOrderToDelete(params.row.id);
            setDeleteDialogOpen(true);
          }}
          color="error"
        />,
      ],
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={fetchData} variant="contained">
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <RestaurantIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                Orders Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage and track all customer orders
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Search and Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search orders by customer, location, contact, or status..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: "background.paper" }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Total Orders
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {orders.length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Orders Table */}
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              loading={loading}
              pageSizeOptions={[10, 25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: "grey.50",
                  borderBottom: "2px solid",
                  borderColor: "divider",
                },
                "& .MuiDataGrid-row:hover": {
                  bgcolor: "action.hover",
                },
                minHeight: 400,
              }}
              disableRowSelectionOnClick
            />
          </CardContent>
        </Card>

        {/* Order Details Modal */}
        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RestaurantIcon />
            Order Details - {selectedOrder?.user?.username || "Unknown"}
          </DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Customer
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedOrder.user?.username || "Unknown"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedOrder.order_date
                        ? new Date(selectedOrder.order_date).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedOrder.location || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Contact
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedOrder.contact || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    {getStatusChip(selectedOrder.status)}
                  </Grid>
                </Grid>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>

            {itemsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {orderItems.map((item) => (
                  <Grid item xs={12} key={item.id}>
                    <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={item.menu.image ? `https://restaurant-backend5.onrender.com${item.menu.image}` : "/placeholder.svg"}
                        alt={item.name || "Item"}
                        sx={{ width: 60, height: 60 }}
                        variant="rounded"
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {item.menu.name || "Unknown"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity || 0}
                        </Typography>
                      </Box>
                      <Chip
                        label={`UGX ${item.menu.price ? item.menu.price.toLocaleString() : "0"}`}
                        color="success"
                        variant="outlined"
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Status Change Menu */}
        <Menu anchorEl={statusMenuAnchor} open={Boolean(statusMenuAnchor)} onClose={handleStatusMenuClose}>
          <MenuItem
            onClick={() => {
              if (selectedOrderForStatus) changeStatus(selectedOrderForStatus.id, "Completed");
            }}
          >
            <CheckCircleIcon sx={{ mr: 1 }} color="success" />
            Completed
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedOrderForStatus) changeStatus(selectedOrderForStatus.id, "In Progress");
            }}
          >
            <ScheduleIcon sx={{ mr: 1 }} color="warning" />
            In Progress
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedOrderForStatus) changeStatus(selectedOrderForStatus.id, "Pending");
            }}
          >
            <ScheduleIcon sx={{ mr: 1 }} color="warning" />
            Pending
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedOrderForStatus) changeStatus(selectedOrderForStatus.id, "Canceled");
            }}
          >
            <CancelIcon sx={{ mr: 1 }} color="error" />
            Canceled
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DeleteIcon color="error" />
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this order? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (orderToDelete) handleDelete(orderToDelete);
              }}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default OrdersManagement;