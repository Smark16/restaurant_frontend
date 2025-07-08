"use client"

import React, { useContext, useState } from "react"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Avatar,
  Divider,
  Paper,
  Container,
  Chip,
  useTheme,
  alpha,
  Fade,
  Tooltip,
  Badge,
  Stepper,
  Step,
  StepLabel,
  TextField,
} from "@mui/material"
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  LocalOffer,
  ArrowForward,
  ShoppingBag,
  Receipt,
  CheckCircle,
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import { AuthContext } from "../Context/AuthContext"

// Mock AuthContext for demonstration
// const AuthContext = React.createContext({
//   data: [
//     {
//       id: 1,
//       name: "Grilled Salmon",
//       price: 38000,
//       image: "/placeholder.svg?height=80&width=80",
//       quantity: 2,
//       category: "dinner",
//     },
//     {
//       id: 2,
//       name: "Caesar Salad",
//       price: 18000,
//       image: "/placeholder.svg?height=80&width=80",
//       quantity: 1,
//       category: "lunch",
//     },
//     {
//       id: 3,
//       name: "Chocolate Cake",
//       price: 15000,
//       image: "/placeholder.svg?height=80&width=80",
//       quantity: 3,
//       category: "dessert",
//     },
//   ],
//   handleDelete: (id) => console.log("Delete item:", id),
//   Increase: (item) => console.log("Increase:", item),
//   Reduce: (item) => console.log("Reduce:", item),
// })

// Cart Item Component
const CartItemCard = ({ item, onDelete, onIncrease, onReduce }) => {
  const theme = useTheme()

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          mb: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.1)}`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Product Image */}
            <Avatar
              src={`http://127.0.0.1:8000/media/${item.product.image}`}
              alt={item.product.name}
              loading='lazy'
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                border: `2px solid ${theme.palette.divider}`,
              }}
            />

            {/* Product Info */}
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {item.product.name}
                </Typography>
                <Tooltip title="Remove from cart">
                  <IconButton
                    onClick={() => onDelete(item.product.id)}
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

              {item.product.category__name && <Chip label={item.product.category__name} size="small" variant="outlined" sx={{ mb: 2 }} />}

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Price */}
                <Box>
                  {/* {item.discount && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                        fontSize: "0.875rem",
                      }}
                    >
                      UGX {(item.price * (1 + item.discount / 100)).toLocaleString()}
                    </Typography>
                  )} */}
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    UGX {item.product.price.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: UGX {(item.product.price * item.quantity).toLocaleString()}
                  </Typography>
                </Box>

                {/* Quantity Controls */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 2,
                    p: 0.5,
                  }}
                >
                  <IconButton
                    onClick={() => onReduce(item.product)}
                    disabled={item.quantity <= 1}
                    size="small"
                    sx={{
                      bgcolor: "white",
                      "&:hover": { bgcolor: "grey.100" },
                      "&:disabled": { bgcolor: "grey.200" },
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      minWidth: 40,
                      textAlign: "center",
                      color: "primary.main",
                    }}
                  >
                    {item.quantity}
                  </Typography>

                  <IconButton
                    onClick={() => onIncrease(item.product)}
                    size="small"
                    sx={{
                      bgcolor: "white",
                      "&:hover": { bgcolor: "grey.100" },
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  )
}

// Order Summary Component
const OrderSummary = ({ items, totalAmount }) => {
  const theme = useTheme()
  const deliveryFee = 5000
  const tax = totalAmount * 0.1
  const finalTotal = totalAmount + deliveryFee + tax

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
    <Paper
      elevation={2}
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
          theme.palette.secondary.main,
          0.05,
        )} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
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

      {/* Item Breakdown */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Items
        </Typography>
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

      {/* Cost Breakdown */}
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
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Total Amount
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          UGX {finalTotal.toLocaleString()}
        </Typography>
      </Box>

      {/* Checkout Button */}
      <Button
        component={Link}
        to="/customer/dashboard/Checkout"
        variant="contained"
        size="large"
        fullWidth
        endIcon={<ArrowForward />}
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
        Proceed to Checkout (UGX {finalTotal.toLocaleString()})
      </Button>

      {/* Security Badge */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2, gap: 1 }}>
        <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
        <Typography variant="caption" color="text.secondary">
          Secure checkout with 256-bit SSL encryption
        </Typography>
      </Box>
    </Paper>
  )
}

// Empty Cart Component
const EmptyCart = () => {
  const theme = useTheme()

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
      <Paper
        sx={{
          p: 6,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
            theme.palette.secondary.main,
            0.05,
          )} 100%)`,
        }}
      >
        <ShoppingCart sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
        </Typography>
        <Button
          component={Link}
          to="/customer/dashboard/customermenuDisplay"
          variant="contained"
          size="large"
          startIcon={<ShoppingBag />}
          sx={{ mt: 2 }}
        >
          Browse Menu
        </Button>
      </Paper>
    </Container>
  )
}

// Progress Stepper Component
const CheckoutProgress = () => {
  const steps = ["Cart", "Checkout", "Payment", "Confirmation"]
  const activeStep = 0

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  )
}

function EnhancedCart() {
  const { addItem, handleDelete, Increase, Reduce } = useContext(AuthContext)
  const [promoCode, setPromoCode] = useState("")

  const totalAmount = addItem
    .map((item) => {
      const { quantity } = item
      return item.product.price * quantity
    })
    .reduce((sum, total) => sum + total, 0)

  if (addItem.length === 0) {
    return <EmptyCart />
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Shopping Cart
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review your items and proceed to checkout
          </Typography>
        </Box>

        {/* Progress Stepper */}
        <CheckoutProgress />

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                  Your Items
                </Typography>
                <Badge badgeContent={addItem.length} color="primary">
                  <ShoppingCart />
                </Badge>
              </Box>

              {addItem.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onIncrease={Increase}
                  onReduce={Reduce}
                />
              ))}
            </Paper>

            {/* Promo Code Section */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocalOffer sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6" fontWeight="bold">
                  Promo Code
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "#ddd" },
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 16px",
                      fontSize: "16px",
                    },
                  }}
                />
                <Button variant="outlined" sx={{ px: 3 }}>
                  Apply
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: "sticky", top: 24 }}>
              <OrderSummary items={addItem} totalAmount={totalAmount} />
            </Box>
          </Grid>
        </Grid>

        {/* Continue Shopping */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            component={Link}
            to="/customer/dashboard/customermenuDisplay"
            variant="outlined"
            size="large"
            startIcon={<ArrowForward sx={{ transform: "rotate(180deg)" }} />}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default EnhancedCart