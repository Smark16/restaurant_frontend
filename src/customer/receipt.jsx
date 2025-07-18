"use client"

import React, { useContext, useEffect, useState, useRef } from "react"
import {
  Box,
  CardContent,
  Typography,
  Button,
  Divider,
  Container,
  Paper,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Alert,
  Fade,
} from "@mui/material"
import {
  Receipt as ReceiptIcon,
  Download,
  CheckCircle,
  LocationOn,
  Phone,
  Restaurant,
  Print,
  Share,
  Star,
} from "@mui/icons-material"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

function EnhancedReceipt() {
  const { user } = useContext(AuthContext)
  const theme = useTheme()
  const receiptRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [userOrder, setUserOrder] = useState(null)
  const [loader, setLoader] = useState(false)
  const [madeOrder, setMadeOrder] = useState([])
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  // Mock data for demonstration
  const mockUserOrder = {
    id: 1,
    location: "123 Main Street, Kampala, Uganda",
    contact: "+256 700 123 456",
    order_date: new Date().toISOString(),
    status: "Confirmed",
    total_amount: 94000,
  }

  const mockMadeOrder = [
    {
      order: mockUserOrder,
      menu: [
        {
          name: "Grilled Salmon with Lemon Butter",
          quantity: 2,
          price: 38000,
          image: "/placeholder.svg?height=50&width=50",
        },
        {
          name: "Caesar Salad",
          quantity: 1,
          price: 18000,
          image: "/placeholder.svg?height=50&width=50",
        },
      ],
    },
  ]

  const fetchUserOrder = async () => {
    try {
      setLoading(true)
      // Mock API call
      setTimeout(() => {
        setUserOrder(mockUserOrder)
        setMadeOrder(mockMadeOrder)
        setLoading(false)
      }, 1000)
    } catch (err) {
      console.error("server error", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserOrder()
  }, [])

  const itemExpense = madeOrder
    .filter((order) => order.order.id === userOrder?.id)
    .reduce((accumulator, order) => {
      order.menu.forEach((item) => {
        const { name, quantity, price } = item
        const totalExpense = price * quantity

        if (!accumulator[name]) {
          accumulator[name] = 0
        }
        accumulator[name] += totalExpense
      })
      return accumulator
    }, {})

  const orderItems = madeOrder.filter((order) => order.order.id === userOrder?.id).flatMap((order) => order.menu)

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 5000
  const tax = subtotal * 0.1
  const totalAmount = subtotal + deliveryFee + tax

  const handleDownload = async () => {
    if (!receiptRef.current) return

    setLoader(true)
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      })

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
      pdf.save(`receipt-${userOrder?.id || "order"}.pdf`)

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setLoader(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Order Receipt",
          text: `Order #${userOrder?.id} - Total: UGX ${totalAmount.toLocaleString()}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    }
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Generating your receipt...
        </Typography>
      </Container>
    )
  }

  if (!userOrder) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">No order found. Please try again.</Alert>
      </Container>
    )
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {/* Success Alert */}
        {downloadSuccess && (
          <Fade in={downloadSuccess}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Receipt downloaded successfully!
            </Alert>
          </Fade>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            startIcon={loader ? <CircularProgress size={20} /> : <Download />}
            onClick={handleDownload}
            disabled={loader}
            sx={{ minWidth: 160 }}
          >
            {loader ? "Downloading..." : "Download PDF"}
          </Button>
          <Button variant="outlined" startIcon={<Print />} onClick={handlePrint}>
            Print Receipt
          </Button>
          <Button variant="outlined" startIcon={<Share />} onClick={handleShare}>
            Share
          </Button>
        </Box>

        {/* Receipt */}
        <Paper
          ref={receiptRef}
          elevation={3}
          sx={{
            maxWidth: 600,
            mx: "auto",
            overflow: "hidden",
            "@media print": {
              boxShadow: "none",
              border: "1px solid #ddd",
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: 4,
              textAlign: "center",
            }}
          >
            <ReceiptIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Order Receipt
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Restaurant Management System
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Order Status */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Chip
                icon={<CheckCircle />}
                label={`Order ${userOrder.status}`}
                color="success"
                size="large"
                sx={{ fontWeight: "bold", fontSize: "1rem", py: 2, px: 3 }}
              />
            </Box>

            {/* Order Details */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Order Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order ID: #{userOrder.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(userOrder.order_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time: {new Date(userOrder.order_date).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.05) }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Customer Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Name: {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {user.email}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Delivery Information */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Delivery Information
              </Typography>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <LocationOn sx={{ mr: 1, mt: 0.5, color: "primary.main" }} />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Delivery Address
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userOrder.location}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Phone sx={{ mr: 1, color: "primary.main" }} />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Contact Number
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userOrder.contact}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Order Items */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Order Items
              </Typography>
              <List>
                {orderItems.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar src={item.image} alt={item.name} sx={{ width: 50, height: 50, borderRadius: 1 }}>
                        <Restaurant />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="medium">
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Qty: {item.quantity} × UGX {item.price.toLocaleString()}
                        </Typography>
                      }
                    />
                    <Typography variant="body1" fontWeight="bold">
                      UGX {(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Cost Breakdown */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">UGX {subtotal.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Delivery Fee</Typography>
                <Typography variant="body2">UGX {deliveryFee.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2">Tax (10%)</Typography>
                <Typography variant="body2">UGX {tax.toLocaleString()}</Typography>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                  p: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  borderRadius: 1,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Total Amount
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  UGX {totalAmount.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: "center", pt: 3, borderTop: "1px dashed #ddd" }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Thank you for your order!
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                For any queries, please contact us at support@restaurant.com
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                <Star sx={{ color: "gold", mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Rate your experience and help us improve!
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Paper>

        {/* Additional Actions */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Need help with your order?
          </Typography>
          <Button variant="text" color="primary">
            Contact Support
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default EnhancedReceipt