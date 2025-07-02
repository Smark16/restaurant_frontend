import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import {
  TrendingUp,
  ShoppingBag,
  People,
  AttachMoney,
  Add,
  TableRestaurant,
  CheckCircle,
  Cancel,
  ArrowForward,
  Close,
  Today,
  CalendarMonth,
  DateRange,
  History,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import { AuthContext } from "../Context/AuthContext";
import useHook from "./customHook";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
    success: {
      main: "#2e7d32",
    },
    warning: {
      main: "#ed6c02",
    },
    error: {
      main: "#d32f2f",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

const orderItemsUrl = "https://restaurant-backend5.onrender.com/restaurant/order_items";
const tablesUrl = "https://restaurant-backend5.onrender.com/restaurant/tables";
const postTableUrl = "https://restaurant-backend5.onrender.com/restaurant/post_table";
const patchTableStatusUrl = "https://restaurant-backend5.onrender.com/restaurant/table_status/";

// Sample data for different time periods
const generateSampleData = (period) => {
  const baseData = {
    today: {
      revenue: 15420,
      orders: 45,
      customers: 38,
      avgRevenue: 342.67,
      chartData: [
        { time: "9AM", orders: 5, revenue: 1200 },
        { time: "11AM", orders: 8, revenue: 2100 },
        { time: "1PM", orders: 12, revenue: 3200 },
        { time: "3PM", orders: 7, revenue: 1800 },
        { time: "6PM", orders: 15, revenue: 4100 },
        { time: "8PM", orders: 10, revenue: 2800 },
      ],
    },
    yesterday: {
      revenue: 12800,
      orders: 38,
      customers: 32,
      avgRevenue: 336.84,
      chartData: [
        { time: "9AM", orders: 4, revenue: 980 },
        { time: "11AM", orders: 6, revenue: 1650 },
        { time: "1PM", orders: 10, revenue: 2800 },
        { time: "3PM", orders: 5, revenue: 1400 },
        { time: "6PM", orders: 13, revenue: 3700 },
        { time: "8PM", orders: 8, revenue: 2270 },
      ],
    },
    thisMonth: {
      revenue: 425600,
      orders: 1240,
      customers: 980,
      avgRevenue: 343.23,
      chartData: [
        { time: "Week 1", orders: 280, revenue: 95200 },
        { time: "Week 2", orders: 320, revenue: 108400 },
        { time: "Week 3", orders: 310, revenue: 105800 },
        { time: "Week 4", orders: 330, revenue: 116200 },
      ],
    },
    lastMonth: {
      revenue: 398200,
      orders: 1180,
      customers: 920,
      avgRevenue: 337.46,
      chartData: [
        { time: "Week 1", orders: 290, revenue: 98600 },
        { time: "Week 2", orders: 295, revenue: 99800 },
        { time: "Week 3", orders: 285, revenue: 96200 },
        { time: "Week 4", orders: 310, revenue: 103600 },
      ],
    },
  };
  return baseData[period] || baseData.today;
};

// Pie chart data for menu categories
const menuCategoryData = [
  { name: "Main Dishes", value: 45, color: "#1976d2" },
  { name: "Appetizers", value: 25, color: "#2e7d32" },
  { name: "Desserts", value: 15, color: "#ed6c02" },
  { name: "Beverages", value: 15, color: "#9c27b0" },
];

// Order status data
const orderStatusData = [
  { name: "Completed", value: 78, color: "#2e7d32" },
  { name: "Pending", value: 15, color: "#ed6c02" },
  { name: "Cancelled", value: 7, color: "#d32f2f" },
];

function StaffDashboard() {
  const { orders, loading, reservations, customer, latest, Revenue, avg } = useHook();
  const { user } = useContext(AuthContext);

  const [tables, setTables] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTable, setNewTable] = useState({ table_no: "", is_booked: false });
  const [selectedPeriod, setSelectedPeriod] = useState(0); // 0: Today, 1: Yesterday, 2: This Month, 3: Last Month

  const periods = ["today", "yesterday", "thisMonth", "lastMonth"];
  const currentData = generateSampleData(periods[selectedPeriod]);

  const handleTabChange = (event, newValue) => {
    setSelectedPeriod(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTable({ ...newTable, [name]: value });
  };

  const handleTable = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("table_no", newTable.table_no);
    formData.append("is_booked", newTable.is_booked.toString());

    try {
      const response = await fetch(postTableUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("New Table Has Been Added Successfully!");
        setShowSnackbar(true);
        setShowModal(false);
        setNewTable({ table_no: "", is_booked: false });
        fetchTables();
      } else {
        setMessage("Failed to add table");
        setShowSnackbar(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Failed to add table");
      setShowSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const response = await fetch(`${patchTableStatusUrl}${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_booked: newStatus }),
      });

      if (response.ok) {
        setTables((prevTables) =>
          prevTables.map((table) => (table.id === id ? { ...table, is_booked: newStatus } : table)),
        );
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await fetch(tablesUrl);
      const data = await response.json();
      setTables(data);
    } catch (err) {
      console.log("No table");
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const statsCards = [
    {
      title: "Total Revenue",
      value: `UGX.${currentData.revenue.toLocaleString()}`,
      icon: <TrendingUp />,
      color: "#1976d2",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Orders",
      value: currentData.orders,
      icon: <ShoppingBag />,
      color: "#2e7d32",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Customers",
      value: currentData.customers,
      icon: <People />,
      color: "#ed6c02",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Average Revenue",
      value: `UGX.${currentData.avgRevenue.toFixed(2)}`,
      icon: <AttachMoney />,
      color: "#9c27b0",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
  ];

  const tabIcons = [<Today />, <History />, <CalendarMonth />, <DateRange />];
  const tabLabels = ["Today", "Yesterday", "This Month", "Last Month"];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
        {/* Welcome Header */}
        <Card
          sx={{
            mb: 4,
            background: " the colors in the gradient are #667eea and #764ba2",
            color: "white",
            position: "relative",
            overflow: "hidden",
           }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <CardContent sx={{ position: "relative", zIndex: 1 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 60, height: 60, backgroundColor: "rgba(255,255,255,0.2)" }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  Welcome, {user?.username}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Restaurant Staff Dashboard
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Time Period Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={selectedPeriod}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": {
                minHeight: 64,
                fontWeight: 600,
              },
            }}
          >
            {tabLabels.map((label, index) => (
              <Tab
                key={index}
                icon={tabIcons[index]}
                label={label}
                iconPosition="start"
                sx={{
                  "&.Mui-selected": {
                    background: " the colors in the gradient are #667eea and #764ba2",
                    color: "white",
                  },
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: stat.gradient,
                  color: "white",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {stat.title}
                      </Typography>
                    </Box>
                    <Avatar sx={{ backgroundColor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Revenue & Orders Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Revenue & Orders Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={currentData.chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "revenue" ? `UGX.${value}` : value,
                        name === "revenue" ? "Revenue" : "Orders",
                      ]}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1976d2"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Revenue"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#2e7d32"
                      fillOpacity={1}
                      fill="url(#colorOrders)"
                      name="Orders"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Pie Charts */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={2}>
              {/* Menu Categories */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Menu Categories
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={menuCategoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {menuCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Order Status */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Order Status
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Orders Table */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Recent Orders
                  </Typography>
                  <Button
                    component={Link}
                    to="/staff/dashboard/orders"
                    endIcon={<ArrowForward />}
                    variant="outlined"
                    size="small"
                  >
                    View All
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.slice(0, 6).map((order, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {order.user.username.charAt(0).toUpperCase()}
                              </Avatar>
                              {order.user.username}
                            </Box>
                          </TableCell>
                          <TableCell>{order.order_date}</TableCell>
                          <TableCell>{order.location}</TableCell>
                          <TableCell>{order.contact}</TableCell>
                          <TableCell>
                            <Chip label={order.status} color="success" size="small" icon={<CheckCircle />} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Reservations Table */}
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Recent Reservations
                  </Typography>
                  <Button
                    component={Link}
                    to="/staff/dashboard/reservations"
                    endIcon={<ArrowForward />}
                    variant="outlined"
                    size="small"
                  >
                    View All
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Customer</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Table</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Party Size</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reservations.slice(0, 6).map((reservation, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {reservation.user.username.charAt(0).toUpperCase()}
                              </Avatar>
                              {reservation.user.username}
                            </Box>
                          </TableCell>
                          <TableCell>{reservation.contact}</TableCell>
                          <TableCell>{reservation.table}</TableCell>
                          <TableCell>{reservation.reservation_date}</TableCell>
                          <TableCell>{reservation.party_size}</TableCell>
                          <TableCell>
                            <Chip label={reservation.status} color="success" size="small" icon={<CheckCircle />} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Table Management */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Manage Tables
                  </Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => setShowModal(true)} size="small">
                    Add Table
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {tables.map((table) => (
                    <ListItem key={table.id} divider>
                      <TableRestaurant sx={{ mr: 2, color: "primary.main" }} />
                      <ListItemText
                        primary={`Table ${table.table_no}`}
                        secondary={
                          <Chip
                            label={table.is_booked ? "Occupied" : "Available"}
                            color={table.is_booked ? "error" : "success"}
                            size="small"
                            icon={table.is_booked ? <Cancel /> : <CheckCircle />}
                          />
                        }
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={table.is_booked}
                          onChange={() => changeStatus(table.id, table.is_booked)}
                          color="primary"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Table Modal */}
        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              Add New Table
              <IconButton onClick={() => setShowModal(false)} size="small">
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <form onSubmit={handleTable}>
            <DialogContent>
              <TextField
                fullWidth
                label="Table Number"
                name="table_no"
                type="number"
                value={newTable.table_no}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newTable.is_booked}
                    onChange={(e) => setNewTable({ ...newTable, is_booked: e.target.checked })}
                  />
                }
                label="Initially Booked"
              />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setShowModal(false)} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Table"}
              </Button>
            </DialogActions>
          </form>
          {isSubmitting && <LinearProgress />}
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setShowSnackbar(false)}
            severity={message.includes("Success") ? "success" : "error"}
            variant="filled"
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default StaffDashboard;