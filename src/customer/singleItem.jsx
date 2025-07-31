"use client"

import React, { useState, useEffect, useContext } from "react"
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Rating,
  Chip,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Container,
  Paper,
  IconButton,
  Fab,
  Breadcrumbs,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  Collapse,
  Badge,
} from "@mui/material"
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  ArrowBack,
  Add,
  Remove,
  ExpandMore,
  ExpandLess,
  Close,
  Send,
  LocalOffer,
  SearchOff 
} from "@mui/icons-material"
import { useParams, Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../Context/AuthContext"
import useAxios from "../components/useAxios"

import { IndexedData } from "../components/IndexedDB";

const post_reviews = 'https://restaurant-backend5.onrender.com/reviews/post_review'
const post_rates = 'https://restaurant-backend5.onrender.com/ratings/rates'

// Similar Product Card Component
const SimilarProductCard = ({ item, onAddToCart }) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        height: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.15)}`,
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="160"
          image={`${item?.image}` || "/placeholder.svg?height=160&width=300"}
          alt={item?.name || "Product"}
          loading='lazy'
        />
        {item?.discount && (
          <Chip
            label={`${item.discount}% OFF`}
            color="error"
            size="small"
            sx={{ position: "absolute", top: 8, right: 8 }}
          />
        )}
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
          {item?.name || "Unnamed Product"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Rating
            value={
              item?.ratings?.length > 0
                ? item.ratings.reduce((total, rating) => total + rating.value, 0) / item.ratings.length
                : 0
            }
            precision={0.1}
            readOnly
            size="small"
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            ({item?.ratings?.length > 0 ? (item.ratings.reduce((total, rating) => total + rating.value, 0) / item.ratings.length).toFixed(1) : 0})
          </Typography>
        </Box>
        <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
          UGX {(item?.price || 0).toLocaleString()}
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ShoppingCart />}
          onClick={() => onAddToCart(item)}
          size="small"
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}

// Review Component
const ReviewCard = ({ review }) => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <Avatar src={review?.image} alt={review?.user?.username || "User"}>
        {review?.user?.username?.charAt(0)?.toUpperCase() || "?"}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {review?.user?.username || "Anonymous"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {review?.created_at ? new Date(review.created_at).toLocaleDateString() : "Unknown Date"}
          </Typography>
        </Box>
        {review?.rating?.value && (
          <Rating value={review.rating.value} readOnly size="small" sx={{ mb: 1 }} />
        )}
        <Typography variant="body2" color="text.secondary">
          {review?.review || "No review text"}
        </Typography>
      </Box>
    </Box>
  </Paper>
)

function SingleMenuEnhanced() {
  const { id } = useParams()
  const { getSingleItem } = IndexedData()
  const navigate = useNavigate()
  const axiosInstance = useAxios()
  const theme = useTheme()
  const { user, handleCart, Increase, Reduce, addItem } = useContext(AuthContext)
  const ItemUrl = `https://restaurant-backend5.onrender.com/restaurant/food_items/${id}`
  const product_reviews = `https://restaurant-backend5.onrender.com/reviews/product_review/${id}`
 
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [similarProducts, setSimilarProducts] = useState([])
  const [quantity, setQuantity] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewText, setReviewText] = useState("")
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [expandedInfo, setExpandedInfo] = useState(false)

  // handle item when offline
  useEffect(()=>{
    getSingleItem(id)
    .then(data => setItem(data))
    .catch(err => console.log('indexed bd err', err))
  }, [id])


  // Fetch product data and reviews
  const fetchData = async () => {
    try {
      setLoading(true)
      const [itemResponse, reviewResponse, similarItemResponse] = await Promise.all([
        axiosInstance.get(ItemUrl),
        axiosInstance.get(product_reviews),
        axiosInstance.get('https://restaurant-backend5.onrender.com/restaurant/food_items')
      ])
      setItem(itemResponse.data)
      setReviews(reviewResponse.data.reviews_products || [])
      setSimilarProducts(similarItemResponse.data.filter(similar => 
        similar.category__name === itemResponse.data.category.name &&
         similar.name != itemResponse.data.name))

    } catch (err) {
      console.error("Error fetching data:", err)
      setItem(null)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

   // Sync cart quantity with local storage
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('clickedItem')) || []
    if (storedItems.length > 0 && addItem.length === 0) {
      // If localStorage has items but addItem is empty, sync them
      setQuantity(storedItems.find((cart) => cart.menu === Number(id))?.quantity || 0)
    }
  }, [addItem, id])

  const handleAddToCart = (product) => {
    if (!product || !product.name) {
      setSnackbarMessage("Cannot add item to cart: Invalid product")
      setSnackbarOpen(true)
      return
    }
    handleCart({ ...product, quantity })
    setSnackbarMessage(`${product.name} added to cart!`)
    setSnackbarOpen(true)
  }

    // Get cart item for the current product
  const cartItem = item ? addItem.find((cart) => cart.menu === item.id) : null

  // Handle rating and review submission
  const handleRatingReviewSubmit = async () => {
    if (!user?.user_id) {
      setSnackbarMessage("Please log in to submit a rating or review")
      setSnackbarOpen(true)
      return
    }

    if (!reviewText.trim() || userRating === 0) {
      setSnackbarMessage("Please provide both a rating and a review")
      setSnackbarOpen(true)
      return
    }

    try {
      // Submit rating
      const ratingResponse = await axiosInstance.post(post_rates, {
        user: user.user_id,
        value: userRating,
        product: id,
      })

      // Submit review
      const reviewResponse = await axiosInstance.post(post_reviews, {
        product: id,
        review: reviewText,
        rating: ratingResponse.data.id, 
        user: user.user_id,
      })

      // Refetch reviews to update the list (ordered by created_at from backend)
      const reviewResponseUpdated = await axiosInstance.get(product_reviews)
      setReviews(reviewResponseUpdated.data.reviews_products || [])

      // Reset form and show success message
      setUserRating(0)
      setReviewText("")
      setReviewDialogOpen(false)
      setSnackbarMessage("Rating and review submitted successfully!")
      setSnackbarOpen(true)
    } catch (err) {
      console.error("Error submitting rating/review:", err)
      setSnackbarMessage("Failed to submit rating or review")
      setSnackbarOpen(true)
    }
  }

  useEffect(() => {
    fetchData()
   
  }, [id])

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={40} width="60%" />
            <Skeleton variant="text" height={100} />
            <Skeleton variant="rectangular" height={60} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Item not found</Alert>
      </Container>
    )
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/customer/dashboard">Dashboard</Link>
          <Link to="/customer/dashboard/customermenuDisplay">Menu</Link>
          <Typography color="text.primary">{item?.name || "Item"}</Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }} variant="outlined">
          Back to Menu
        </Button>

        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Card sx={{ position: "relative" }}>
              {item?.discount && (
                <Chip
                  label={`${item.discount}% OFF`}
                  color="error"
                  icon={<LocalOffer />}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 2,
                    fontWeight: "bold",
                  }}
                />
              )}
              <CardMedia
                component="img"
                image={`https://res.cloudinary.com/dnsx36nia/${item?.image}`}
                alt={item?.name || "Item"}
                loading="lazy"
                sx={{
                  height: 400,
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  display: "flex",
                  gap: 1,
                }}
              >
                <IconButton
                  onClick={() => setIsFavorite(!isFavorite)}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "white" },
                  }}
                >
                  {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                <IconButton
                  sx={{
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "white" },
                  }}
                >
                  <Share />
                </IconButton>
              </Box>
            </Card>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {item?.name || "Unnamed Item"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Rating
                    value={
                      item?.ratings?.length > 0
                        ? item.ratings.reduce((total, rating) => total + rating.value, 0) / item.ratings.length
                        : 0
                    }
                    precision={0.1}
                    readOnly
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({item?.ratings?.length > 0 ? (item.ratings.reduce((total, rating) => total + rating.value, 0) / item.ratings.length).toFixed(1) : 0}/5) • {reviews.length} reviews
                  </Typography>
                  <Chip label={item?.category?.name || "Uncategorized"} color="primary" variant="outlined" size="small" />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {item?.discount && (
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                      }}
                    >
                      UGX {(item?.price * (1 + item.discount / 100)).toLocaleString()}
                    </Typography>
                  )}
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    UGX {(item?.price || 0).toLocaleString()}
                  </Typography>
                  {item?.discount && <Chip label={`Save ${item.discount}%`} color="success" size="small" />}
                </Box>
              </Box>

              {/* Description */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {item?.descriptions || "No description available"}
                </Typography>
              </Box>

              {/* Additional Info */}
              <Box sx={{ mb: 3 }}>
                <Button
                  onClick={() => setExpandedInfo(!expandedInfo)}
                  endIcon={expandedInfo ? <ExpandLess /> : <ExpandMore />}
                  variant="outlined"
                  fullWidth
                >
                  {expandedInfo ? "Hide Details" : "Show Details"}
                </Button>
                <Collapse in={expandedInfo}>
                  <Box sx={{ mt: 2 }}>
                    {item?.ingredients && Array.isArray(item.ingredients) && item.ingredients.length > 0 ? (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Ingredients:
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {item.ingredients.map((ingredient, index) => (
                            <Chip key={index} label={ingredient} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No ingredients listed.
                      </Typography>
                    )}
                  </Box>
                </Collapse>
              </Box>

              {/* Quantity and Add to Cart */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quantity
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <IconButton
                      onClick={() => {
                        if (cartItem) {
                          Reduce(item)
                        } 
                      }}
                      disabled={!cartItem && quantity <= 1}
                    >
                       <Remove />
                       </IconButton>
                  <Typography variant="h6" sx={{ minWidth: 40, textAlign: "center" }}>
                    {cartItem ? cartItem.quantity : quantity}
                  </Typography>
                  <IconButton
                      onClick={() => {
                        if (cartItem) {
                          Increase(item)
                        } 
                      }}
                      disabled={!cartItem}
                    >
                    <Add />
                  </IconButton>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={() => handleAddToCart(item)}
                  disabled={!item?.is_available}
                  sx={{ py: 1.5, fontSize: "1.1rem", fontWeight: "bold" }}
                >
                   {item.is_available
                      ? `Add to Cart - UGX ${(item.price * (cartItem?.quantity || 1)).toLocaleString()}`
                      : "Out of Stock"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Reviews Section */}
        <Box sx={{ mt: 6 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Customer Reviews ({reviews.length})
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => setReviewDialogOpen(true)}>
              Review & Rating
            </Button>
          </Box>

          {reviews.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No reviews yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Be the first to review this dish!
              </Typography>
            </Paper>
          ) : (
            <>
              {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
              {reviews.length > 3 && (
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    endIcon={showAllReviews ? <ExpandLess /> : <ExpandMore />}
                  >
                    {showAllReviews ? "Show Less" : `View All Reviews (${reviews.length - 3} more)`}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>

        {/* You May Also Like Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            You May Also Like
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Similar dishes from our {item?.category?.name || "menu"}
          </Typography>
          <Grid container spacing={3}>
            {similarProducts.length === 0 && (<SearchOff style={{width:'100px', height:"100px", justifyContent:"center", color:'red'}}/>)}
            {similarProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <SimilarProductCard item={product} onAddToCart={handleAddToCart} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Write a Review
            <IconButton onClick={() => setReviewDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Your Rating
            </Typography>
            <Rating
              value={userRating}
              onChange={(event, newValue) => {
                setUserRating(newValue || 0)
              }}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this dish..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleRatingReviewSubmit}
            disabled={!reviewText.trim() || userRating === 0}
            startIcon={<Send />}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Cart */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        component={Link}
        to="/customer/dashboard/cart"
      >
        <Badge badgeContent={cartItem ? cartItem.quantity : quantity} color="error">
          <ShoppingCart />
        </Badge>
      </Fab>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes("Failed") ? "error" : "success"}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SingleMenuEnhanced