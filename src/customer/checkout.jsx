"use client"

import React, { useContext, useState } from "react"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  useTheme,
  alpha,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material"
import {
  LocationOn,
  Phone,
  Payment,
  Receipt,
  LocalShipping,
  CreditCard,
  AccountBalanceWallet,
  ExpandMore,
  CheckCircle,
  Schedule,
  Security,
  ShoppingBag,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
// import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3'

// Mock AuthContext for demonstration
const AuthContext = React.createContext({
  data: [
    {
      id: 1,
      name: "Grilled Salmon",
      price: 38000,
      image: "/placeholder.svg?height=60&width=60",
      quantity: 2,
    },
    {
      id: 2,
      name: "Caesar Salad",
      price: 18000,
      image: "/placeholder.svg?height=60&width=60",
      quantity: 1,
    },
  ],
  user: {
    user_id: 1,
    username: "John Doe",
    email: "john@example.com",
  },
  setAddItem: (items) => console.log("Set items:", items),
  setTotal: (total) => console.log("Set total:", total),
})

// Order Summary Component
const OrderSummaryCard = ({ items, totalAmount }) => {
  const theme = useTheme()
  const deliveryFee = 5000
  const tax = totalAmount * 0.1
  const finalTotal = totalAmount + deliveryFee + tax

  const itemExpense = items.reduce((accumulator, item) => {
    const { name, quantity, price } = item
    const totalExpense = price * quantity

    if (!accumulator[name]) {
      accumulator[name] = 0
    }
    accumulator[name] += totalExpense
    return accumulator
  }, {})

  return (
    <Card
      elevation={3}
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
          theme.palette.secondary.main,
          0.05,
        )} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Receipt sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h5" fontWeight="bold">
            Order Summary
          </Typography>
        </Box>

        {/* Items Count */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Chip
            icon={<ShoppingBag />}
            label={`${items.length} ${items.length === 1 ? "Item" : "Items"}`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        {/* Items List */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" fontWeight="bold">
              Order Items
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {items.map((item) => (
                <ListItem key={item.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar src={item.image} alt={item.name} sx={{ width: 50, height: 50 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`Qty: ${item.quantity} × UGX ${item.price.toLocaleString()}`}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    UGX {(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Cost Breakdown */}
        <Box sx={{ mb: 3 }}>
          {Object.keys(itemExpense).map((itemName) => (
            <Box key={itemName} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {itemName}
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                UGX {itemExpense[itemName].toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Additional Costs */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2" fontWeight="medium">
              UGX {totalAmount.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">Delivery Fee</Typography>
            <Typography variant="body2" fontWeight="medium">
              UGX {deliveryFee.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">Tax (10%)</Typography>
            <Typography variant="body2" fontWeight="medium">
              UGX {tax.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Total */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Total Amount
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            UGX {finalTotal.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

// Payment Method Component
const PaymentMethodCard = ({ paymentMethod, onPaymentMethodChange, onFlutterwavePayment }) => {
  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Payment sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" fontWeight="bold">
            Payment Method
          </Typography>
        </Box>

        <FormControl component="fieldset" fullWidth>
          <RadioGroup value={paymentMethod} onChange={(e) => onPaymentMethodChange(e.target.value)}>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                border: paymentMethod === "cash" ? "2px solid" : "1px solid",
                borderColor: paymentMethod === "cash" ? "primary.main" : "divider",
                transition: "all 0.3s ease",
              }}
            >
              <FormControlLabel
                value="cash"
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalShipping color="primary" />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Cash on Delivery
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pay when your order arrives
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </Paper>

            <Paper
              sx={{
                p: 2,
                border: paymentMethod === "instant" ? "2px solid" : "1px solid",
                borderColor: paymentMethod === "instant" ? "primary.main" : "divider",
                transition: "all 0.3s ease",
              }}
            >
              <FormControlLabel
                value="instant"
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CreditCard color="primary" />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Instant Payment
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pay now with Flutterwave
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </Paper>
          </RadioGroup>
        </FormControl>

        {paymentMethod === "instant" && (
          <Box sx={{ mt: 3, p: 2, bgcolor: "primary.light", borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Security sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body2" color="primary.main" fontWeight="medium">
                Secure Payment with Flutterwave
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<AccountBalanceWallet />}
              onClick={onFlutterwavePayment}
              sx={{
                background: "linear-gradient(45deg, #f39c12 30%, #e67e22 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #e67e22 30%, #d35400 90%)",
                },
              }}
            >
              Pay with Flutterwave
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

function EnhancedCheckout() {
  const { data, user, setAddItem, setTotal } = useContext(AuthContext)
  const navigate = useNavigate()
  const theme = useTheme()

  const [info, setInfo] = useState({ location: "", contact: "" })
  const [orderId, setOrderId] = useState("")
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [orderError, setOrderError] = useState("")
  const [activeStep, setActiveStep] = useState(0)
  const [infoSaved, setInfoSaved] = useState(false)

  const steps = ["Delivery Info", "Payment Method", "Confirm Order"]

  const totalAmount = data
    .map((item) => {
      const { price, quantity } = item
      return price * quantity
    })
    .reduce((sum, total) => sum + total, 0)

  // Flutterwave config (commented out for demo)
  /*
  const config = {
    public_key: 'FLWPUBK_TEST-64ed21a038fb9488488027e6c5ef2e70-X',
    tx_ref: Date.now(),
    amount: totalAmount,
    currency: 'UGX',
    payment_options: 'card, mobilemoneyuganda, banktransfer',
    customer: {
      email: user.email,
      phone_number: info.contact,
      name: user.username,
    },
    customizations: {
      title: 'Restaurant Management System',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  }
  */

  const handleChange = (e) => {
    const { name, value } = e.target
    setInfo({ ...info, [name]: value })
  }

  const handleInfoSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock API call
      setTimeout(() => {
        setLoading(false)
        setInfoSaved(true)
        setActiveStep(1)
        console.log("Info saved:", info)
      }, 1000)
    } catch (error) {
      setLoading(false)
      setOrderError("Failed to save delivery information")
    }
  }

  const handleFinalSubmit = async (e) => {
    e.preventDefault()
    setLoader(true)

    try {
      // Mock API call
      setTimeout(() => {
        setAddItem([])
        setTotal("")
        localStorage.removeItem("clickedItem")
        navigate("/customer/dashboard/receipt")
      }, 2000)
    } catch (err) {
      console.log("There was an error", err)
      setOrderError("Please fill in all the required credentials")
      setLoader(false)
    }
  }

  const handleFlutterwavePayment = () => {
    console.log("Flutterwave payment initiated")
    // FlutterWave integration would go here
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Checkout
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete your order by providing delivery details and payment information
          </Typography>
        </Box>

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

        {/* Error Alert */}
        {orderError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setOrderError("")}>
            {orderError}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Left Column - Forms */}
          <Grid item xs={12} lg={8}>
            {/* Delivery Information */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <LocalShipping sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" fontWeight="bold">
                    Delivery Information
                  </Typography>
                  {infoSaved && <CheckCircle sx={{ ml: 2, color: "success.main" }} />}
                </Box>

                <form onSubmit={handleInfoSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Delivery Location"
                        name="location"
                        value={info.location}
                        onChange={handleChange}
                        required
                        disabled={infoSaved}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOn color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        helperText="Please provide your complete delivery address"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Contact Number"
                        name="contact"
                        type="tel"
                        value={info.contact}
                        onChange={handleChange}
                        required
                        disabled={infoSaved}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        helperText="We'll use this number to contact you about your delivery"
                      />
                    </Grid>
                  </Grid>

                  {!infoSaved && (
                    <Box sx={{ mt: 3 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                        sx={{ minWidth: 150 }}
                      >
                        {loading ? "Saving..." : "Save Info"}
                      </Button>
                    </Box>
                  )}

                  {infoSaved && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: "success.light", borderRadius: 1 }}>
                      <Typography variant="body2" color="success.dark">
                        ✓ Delivery information saved successfully
                      </Typography>
                    </Box>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            {infoSaved && (
              <PaymentMethodCard
                paymentMethod={paymentMethod}
                onPaymentMethodChange={(method) => {
                  setPaymentMethod(method)
                  setActiveStep(2)
                }}
                onFlutterwavePayment={handleFlutterwavePayment}
              />
            )}

            {/* Final Confirmation */}
            {infoSaved && paymentMethod && (
              <Card elevation={2}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Schedule sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" fontWeight="bold">
                      Confirm Your Order
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                    <Typography variant="body2" color="info.dark">
                      <strong>Delivery to:</strong> {info.location}
                      <br />
                      <strong>Contact:</strong> {info.contact}
                      <br />
                      <strong>Payment:</strong> {paymentMethod === "cash" ? "Cash on Delivery" : "Instant Payment"}
                    </Typography>
                  </Box>

                  <form onSubmit={handleFinalSubmit}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loader}
                      startIcon={loader ? <CircularProgress size={20} /> : <CheckCircle />}
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
                      {loader ? "Processing Order..." : `Confirm Order - UGX ${totalAmount.toLocaleString()}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: "sticky", top: 24 }}>
              <OrderSummaryCard items={data} totalAmount={totalAmount} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default EnhancedCheckout