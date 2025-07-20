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
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  HourglassEmpty as HourglassIcon,
  TableRestaurant as TableIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  Search as SearchIcon,
  EventSeat as ReservationIcon,
} from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const reservationUrl = "https://restaurant-backend5.onrender.com/reservations/all_resrvations";

function ReservationManagement() {
  const { user, notifyAll, setNotifyAll } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [selectedReservationForStatus, setSelectedReservationForStatus] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(reservationUrl);
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format: Expected an array of reservations");
      }
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to load reservations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://restaurant-backend5.onrender.com/reservations/delete_reservation/${id}`);
      setReservations((prevReservations) => prevReservations.filter((reservation) => reservation.id !== id));
      setDeleteDialogOpen(false);
      setReservationToDelete(null);
    } catch (err) {
      console.error("Error deleting reservation:", err);
      setError(err.response?.data?.message || "Failed to delete reservation. Please try again.");
    }
  };

  const changeStatus = async (id, newStatus) => {
    if (!user) {
      setError("You must be logged in to update reservation status.");
      return;
    }

    try {
      await axios.patch(`https://restaurant-backend5.onrender.com/reservations/update_reservation/${id}`, {"status" : newStatus});
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === id ? { ...reservation, status: newStatus } : reservation,
        ),
      );
      setStatusMenuAnchor(null);
      setSelectedReservationForStatus(null);

    } catch (err) {
      console.error("Error changing status:", err);
      setError(err.response?.data?.message || "Failed to update reservation status. Please try again.");
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      Accepted: { color: "success", icon: <CheckCircleIcon />, label: "Accepted" },
      Rejected: { color: "error", icon: <CancelIcon />, label: "Rejected" },
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

  const handleStatusMenuOpen = (event, reservation) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedReservationForStatus(reservation);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
    setSelectedReservationForStatus(null);
  };

  const filteredReservations = reservations.filter((reservation) => {
    const username = reservation.user?.username ? reservation.user.username.toLowerCase() : "";
    const contact = reservation.contact ? reservation.contact.toString() : "";
    const search = searchText.toLowerCase();
    return username.includes(search) || contact.includes(search) || table.includes(search);
  });

  const getReservationStats = () => {
    const total = reservations.length;
    const accepted = reservations.filter((r) => r.status === "Accepted").length;
    const pending = reservations.filter((r) => r.status === "Pending" || r.status === "").length;
    const rejected = reservations.filter((r) => r.status === "Rejected").length;

    return { total, accepted, pending, rejected };
  };

  const stats = getReservationStats();

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
      field: "table",
      headerName: "Table",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TableIcon fontSize="small" color="action" />
          <Chip label={params.value || "N/A"} size="small" variant="outlined" color="primary" />
        </Box>
      ),
    },
    {
      field: "reservation_date",
      headerName: "Date & Time",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarIcon fontSize="small" color="action" />
          <Box>
            <Typography variant="body2">
              {params.value ? new Date(params.value).toLocaleDateString() : "N/A"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.value
                ? new Date(params.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "N/A"}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "party_size",
      headerName: "Party Size",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GroupIcon fontSize="small" color="action" />
          <Chip
            label={params.value ? `${params.value} guests` : "N/A"}
            size="small"
            variant="outlined"
            color="secondary"
          />
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
            setReservationToDelete(params.row.id);
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
        <Paper sx={{ p: 3, mb: 3, bgcolor: "secondary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ReservationIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                Reservation Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage and track all table reservations
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Search and Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search reservations by customer, contact, table, or status..."
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
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {stats.total}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={3}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Accepted
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {stats.accepted}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={3}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {stats.pending}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={3}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Rejected
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="error.main">
                    {stats.rejected}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Reservations Table */}
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <DataGrid
              rows={filteredReservations}
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

        {/* Status Change Menu */}
        <Menu anchorEl={statusMenuAnchor} open={Boolean(statusMenuAnchor)} onClose={handleStatusMenuClose}>
          <MenuItem
            onClick={() => {
              if (selectedReservationForStatus) {
                changeStatus(
                  selectedReservationForStatus.id,
                  "Accepted",
                );
              }
            }}
          >
            <CheckCircleIcon sx={{ mr: 1 }} color="success" />
            Accept Reservation
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedReservationForStatus) {
                changeStatus(
                  selectedReservationForStatus.id,
                  "Pending",
                );
              }
            }}
          >
            <ScheduleIcon sx={{ mr: 1 }} color="warning" />
            Mark as Pending
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedReservationForStatus) {
                changeStatus(
                  selectedReservationForStatus.id,
                  "Rejected",
                );
              }
            }}
          >
            <CancelIcon sx={{ mr: 1 }} color="error" />
            Reject Reservation
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DeleteIcon color="error" />
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this reservation? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (reservationToDelete) handleDelete(reservationToDelete);
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

export default ReservationManagement;