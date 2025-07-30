"use client"

import React, { useContext, useEffect, useState, useRef } from "react"
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
  Alert,
  Snackbar,
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
import { AuthContext } from "../Context/AuthContext"
import useAxios from '../components/useAxios'

// Order Summary Component
const OrderSummaryCard = ({ items, totalAmount }) => {
  const theme = useTheme()
  const deliveryFee = 5000
  const finalTotal = totalAmount + deliveryFee

  const itemExpense = items.reduce((accumulator, item) => {
    const { quantity} = item
    const totalExpense = item.product.price * quantity

    if (!accumulator[item.product.name]) {
      accumulator[item.product.name] = 0
    }
    accumulator[item.product.name] += totalExpense
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
                <ListItem key={item.menu} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar src={item.product.image} alt={item.product.name} sx={{ width: 50, height: 50 }} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.product.name}
                    secondary={`Qty: ${item.quantity} × UGX ${item.product.price.toLocaleString()}`}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    UGX {(item.product.price * item.quantity).toLocaleString()}
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
const PaymentMethodCard = ({ paymentMethod, onPaymentMethodChange, onPesaPalPayment, contact, location, loading }) => {
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
                Secure Payment with Pesapal
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<AccountBalanceWallet />}
              onClick={onPesaPalPayment}
              sx={{
                background: "linear-gradient(45deg, #f39c12 30%, #e67e22 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #e67e22 30%, #d35400 90%)",
                },
              }}
              disabled={contact === '' && location === ''}
            >
              {loading ? 'processing...' : 'Make Payment'}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

function EnhancedCheckout() {
  const { addItem, user, setAddItem, setTotal, websocket  } = useContext(AuthContext)
 const axiosInstance = useAxios()
  const navigate = useNavigate()
  const theme = useTheme()
  const post_orderInfo = 'https://restaurant-backend5.onrender.com/orders/placed_orders'
  const make_payment = 'https://restaurant-backend5.onrender.com/payments/make_payment'
  const post_picked_items = 'https://restaurant-backend5.onrender.com/orders/post_picked_items'

  const [info, setInfo] = useState(() => {
    const savedInfo = localStorage.getItem('info')
    return savedInfo ? JSON.parse(savedInfo) : { location: '', contact: '' }
  })
  const [orderId, setOrderId] = useState("")
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [orderError, setOrderError] = useState("")
  const [activeStep, setActiveStep] = useState(0)
  const [infoSaved, setInfoSaved] = useState(false)
  const [trackId, setTrackId] = useState('')
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const steps = ["Delivery Info", "Payment Method", "Confirm Order"]

  const totalAmount = addItem
    .map((item) => {
      const { quantity } = item
      return item.product.price * quantity
    })
    .reduce((sum, total) => sum + total, 0)

    // store user info in local storage
    useEffect(()=>{
      localStorage.setItem('info', JSON.stringify(info))
    }, [info])

  const handleChange = (e) => {
    const { name, value } = e.target
    setInfo((prevInfo) =>({
      ...prevInfo, [name]:value
    }))
    
  }

   // make payment post
   const handlePesaPalPayment = async() => {
     try{
        setLoading(true)
        const response = await axiosInstance.post(make_payment, {
         amount:totalAmount,
         email_address:user?.email,
         phone_number:info.contact,
         first_name:user?.username
    })
    
    if (response.data.status === 'success' && response.data.data.redirect_url) {
      setTrackId(response.data.data.order_tracking_id)
      setLoading(false)
      window.location.href = response.data.data.redirect_url
    }
      
    }catch(err){
      console.log('err', err)
    }
 }

  const handleFinalSubmit = async (e) => {
  e.preventDefault();
  setLoader(true);

  try {
    // Post order info
    const orderResponse = await axiosInstance.post(post_orderInfo, {
      user: user?.user_id,
      location: info.location,
      contact: info.contact,
      payment_method: paymentMethod,
      Tracking_Id: trackId
    });

    if (orderResponse.status !== 201) {
      throw new Error('Failed to create order');
    }

    const orderId = orderResponse.data.id;
    setOrderId(orderId);
    setInfoSaved(true);
    setActiveStep(1);

    // Post each addItem to create OrderTaken instances
    const orderTakenIds = await Promise.all(
      addItem.map(async (item) => {
        const picketItemResponse = await axiosInstance.post(post_picked_items, {
          menu: Number(item.menu), // Use item.menu instead of item.product.id
          quantity: Number(item.quantity)
        });

        if (picketItemResponse.status !== 201) {
          throw new Error(`Failed to create OrderTaken for menu ${item.menu}`);
        }

        return picketItemResponse.data.id; 
      })
    );

    // Post order items with takenItems as a list of OrderTaken IDs
    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
      websocket.current.send(JSON.stringify({
          user: user?.user_id,
          order:orderId,
          takenItems:orderTakenIds
      }));
  }

    setAddItem([]);
    setTotal('');
    setSnackbarMessage("Order Successfully Placed\n An order receipt will be sent to your gmail")
    setSnackbarOpen(true)
    localStorage.removeItem('clickedItem');
    localStorage.removeItem('info');

    setTimeout(()=>{
      navigate('/customer/dashboard/customerOrder');
    }, 5000)

  } catch (err) {
    console.error('Error response:', err);
    setOrderError('Please fill in all the required credentials');
    setSnackbarMessage("Failed to process receit")
    setSnackbarOpen(true)
    setLoader(false);
  }
};

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

                <form onSubmit={handleFinalSubmit}>
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

                </form>
              </CardContent>
            </Card>

            {/* Payment Method */}
              <PaymentMethodCard
                paymentMethod={paymentMethod}
                onPaymentMethodChange={(method) => {
                  setPaymentMethod(method)
                  setActiveStep(2)
                }}
                onPesaPalPayment={handlePesaPalPayment}
                contact={info.contact}
                location={info.location}
                loading={loading}
              />
          
            {/* Final Confirmation */}
            {paymentMethod && (
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
              <OrderSummaryCard items={addItem} totalAmount={totalAmount} />
            </Box>
          </Grid>
        </Grid>
      </Container>

       {/* Success Snackbar */}
       <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  )
}

export default EnhancedCheckout