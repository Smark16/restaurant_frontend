"use client"

import React, { useContext, useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Container,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  InputAdornment,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import {
  EventSeat,
  Phone,
  Email,
  People,
  CalendarToday,
  CheckCircle,
  Restaurant,
  AccessTime,
  LocationOn,
  Celebration,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../Context/AuthContext"
import useAxios from "../components/useAxios"

// Table Card Component
const TableCard = ({ table, isSelected, onSelect }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: isSelected ? `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.15)}`,
        },
        opacity: !table.is_booked ? 1 : 0.6,
      }}
      onClick={() => !table.is_booked && onSelect(table.id.toString())}
    >
      <CardContent sx={{ textAlign: "center", p: 3 }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            bgcolor: isSelected ? "primary.main" : !table.is_booked ? "success.main" : "grey.400",
            mx: "auto",
            mb: 2,
          }}
        >
          <EventSeat sx={{ fontSize: 30 }} />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Table {table.table_no}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Capacity: {table.capacity} people
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Location: {table.location}
        </Typography>
        <Chip
          label={!table.is_booked ? "Available" : "Occupied"}
          color={!table.is_booked ? "success" : "error"}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  )
}

// Reservation Summary Component
const ReservationSummary = ({ reservation, selectedTable }) => {
  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Reservation Summary
        </Typography>
        <List>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <People color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Party Size"
              secondary={reservation.party_size ? `${reservation.party_size} people` : "Not selected"}
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <EventSeat color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Table"
              secondary={selectedTable ? `Table ${selectedTable.table_no} (${selectedTable.location})` : "Not selected"}
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <CalendarToday color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Date & Time"
              secondary={
                reservation.reservation_date
                  ? new Date(reservation.reservation_date).toLocaleDateString()
                  : "Not selected"
              }
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <Phone color="primary" />
            </ListItemIcon>
            <ListItemText primary="Contact" secondary={reservation.contact || "Not provided"} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )
}

function EnhancedReservations() {
  const { user, showSuccessAlert, showErrorAlert } = useContext(AuthContext)
  const navigate = useNavigate()
  const theme = useTheme()
  const axiosInstance = useAxios()

  const post_reservations = 'http://127.0.0.1:8000/reservations/new_reservation'
  const table_list = 'http://127.0.0.1:8000/tables/tables'

  const [reservation, setReservation] = useState({
    user:user?.user_id,
    contact: "",
    email: "",
    party_size: "",
    table: null,
    reservation_date: "",
  })

  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const steps = ["Reservation Details", "Select Table", "Confirm Booking"]
  
//get tables
  const fetchTables = async () => {
    try {
      setLoading(true)
      const tableList = await axiosInstance.get(table_list)
      setTables(tableList.data)
      // Mock API call
      setLoading(false)
    } catch (err) {
      console.log("No table", err)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setReservation({ ...reservation, [name]: value })
  }

  const handleTableSelect = (tableId) => {
    setReservation({ ...reservation, table: Number(tableId) })
  }

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate step 1
      if (!reservation.contact || !reservation.email || !reservation.party_size || !reservation.reservation_date) {
        setErrorMessage("Please fill in all required fields")
        setSnackbarOpen(true)
        return
      }
    } else if (activeStep === 1) {
      // Validate step 2
      if (!reservation.table) {
        setErrorMessage("Please select a table")
        setSnackbarOpen(true)
        return
      }
    }
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }
  console.log('reservation', reservation)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setConfirmed(true)

    try {
      await axiosInstance.post(post_reservations, {
        user:user?.user_id,
        contact:reservation.contact,
        email:reservation.email,
        party_size:reservation.party_size,
        reservation_date:reservation.reservation_date,
        table:reservation.table
      }).then(res =>{
        if(res.status === 201){
          showSuccessAlert("Reservation Made Successfully")
          setConfirmed(false)
          navigate("/customer/dashboard")
        }
      })
  
    } catch (err) {
      console.log("An error occurred", err)
      showErrorAlert("Failed to make reservation. Please try again.")
      setConfirmed(false)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  const selectedTable = tables.find((table) => table.id.toString() === reservation.table)
  const availableTables = tables.filter((table) => !table.is_booked)

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

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
            <Celebration sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Make a Reservation
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Reserve your perfect dining experience with us
            </Typography>
          </Box>
        </Paper>

        {/* Progress Stepper */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={({ active, completed }) => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: completed ? "success.main" : active ? "primary.main" : "grey.300",
                        color: completed || active ? "white" : "text.secondary",
                        fontWeight: "bold",
                      }}
                    >
                      {completed ? <CheckCircle /> : index + 1}
                    </Box>
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            {/* Step 1: Reservation Details */}
            {activeStep === 0 && (
              <Card elevation={2}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Reservation Details
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Please provide your contact information and reservation preferences
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contact Number"
                        name="contact"
                        type="tel"
                        value={reservation.contact}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        helperText="We'll use this to confirm your reservation"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={reservation.email}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        helperText="Confirmation details will be sent here"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Party Size"
                        name="party_size"
                        type="number"
                        value={reservation.party_size}
                        onChange={handleChange}
                        required
                        inputProps={{ min: 1, max: 12 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <People color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        helperText="Number of guests (1-12)"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Reservation Date"
                        name="reservation_date"
                        type="date"
                        value={reservation.reservation_date}
                        onChange={handleChange}
                        required
                        inputProps={{ min: today }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        helperText="Select your preferred date"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Table Selection */}
            {activeStep === 1 && (
              <Card elevation={2}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Select Your Table
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Choose from our available tables for {reservation.party_size} people
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Chip
                      icon={<Restaurant />}
                      label={`${availableTables.length} tables available`}
                      color="success"
                      variant="outlined"
                    />
                  </Box>

                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {tables.map((table) => (
                        <Grid item xs={12} sm={6} md={4} key={table.id}>
                          <TableCard
                            table={table}
                            isSelected={reservation.table === table.id}
                            onSelect={handleTableSelect}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirmation */}
            {activeStep === 2 && (
              <Card elevation={2}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Confirm Your Reservation
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Please review your reservation details before confirming
                  </Typography>

                  <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.1), mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                      Reservation Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Guest Name
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user.username}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Contact
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {reservation.contact}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Party Size
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {reservation.party_size} people
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Table
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          Table {selectedTable?.table_no} ({selectedTable?.location})
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {new Date(reservation.reservation_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      <strong>Please note:</strong> Your reservation will be confirmed within 30 minutes. You'll receive
                      a confirmation email at {reservation.Email}.
                    </Typography>
                  </Alert>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={confirmed}
                    startIcon={confirmed ? <CircularProgress size={20} /> : <CheckCircle />}
                    sx={{
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
                      },
                    }}
                  >
                    {confirmed ? "Confirming Reservation..." : "Confirm Reservation"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button onClick={handleBack} disabled={activeStep === 0} variant="outlined">
                Back
              </Button>
              {activeStep < steps.length - 1 && (
                <Button onClick={handleNext} variant="contained">
                  Next
                </Button>
              )}
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <ReservationSummary reservation={reservation} selectedTable={selectedTable} />

            {/* Restaurant Info */}
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Restaurant Information
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Location" secondary="123 Main Street, Kampala, Uganda" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <AccessTime color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Hours" secondary="Mon-Sun: 10:00 AM - 11:00 PM" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Contact" secondary="+256 700 123 456" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar for errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default EnhancedReservations