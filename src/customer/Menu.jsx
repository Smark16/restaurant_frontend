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
  TextField,
  InputAdornment,
  Chip,
  Rating,
  Skeleton,
  Container,
  Paper,
  IconButton,
  Fade,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  CardActions,
  Badge,
  Tabs,
  Tab,
  Pagination,
  Stack,
  Tooltip,
} from "@mui/material"
import {
  Search as SearchIcon,
  ShoppingCart,
  Visibility,
  Check,
  Restaurant,
  LocalOffer,
  WbSunny,
  LunchDining,
  DinnerDining,
  Fastfood,
  FilterList,
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import { AuthContext } from "../Context/AuthContext"
import useAxios from "../components/useAxios"

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`meal-tabpanel-${index}`}
      aria-labelledby={`meal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

// Food Item Card Component
const FoodItemCard = ({ item, isAdded, onAddToCart }) => {
  const theme = useTheme()
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.15)}`,
          },
          position: "relative",
          overflow: "visible",
          opacity: item.is_available === false ? 0.6 : 1,
        }}
      >
        {/* Badges */}
        <Box
          sx={{ position: "absolute", top: 12, right: 12, zIndex: 2, display: "flex", flexDirection: "column", gap: 1 }}
        >
          {item.discount && (
            <Chip
              label={`${item.discount}% OFF`}
              color="error"
              size="small"
              icon={<LocalOffer />}
              sx={{ fontWeight: "bold" }}
            />
          )}
          {item.is_available === false && (
            <Chip label="Out of Stock" color="default" size="small" sx={{ bgcolor: "grey.500", color: "white" }} />
          )}
        </Box>

        {/* Food Image */}
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              height={200}
              sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />
          )}
          <CardMedia
            component="img"
            height="200"
            image={item.image}
            alt={item.name}
            Loading='lazy'
            onLoad={() => setImageLoaded(true)}
            sx={{
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.7))",
              opacity: 0,
              transition: "opacity 0.3s ease",
              "&:hover": { opacity: 1 },
              display: "flex",
              alignItems: "flex-end",
              p: 2,
            }}
          >
            <Button
              component={Link}
              to={`/customer/dashboard/item/${item.id}`}
              variant="contained"
              size="small"
              startIcon={<Visibility />}
              sx={{
                bgcolor: "rgba(255,255,255,0.9)",
                color: "text.primary",
                "&:hover": { bgcolor: "white" },
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Food Name and Price */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1, mr: 1 }}>
              {item.name}
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              {item.discount && (
                <Typography
                  variant="body2"
                  sx={{ textDecoration: "line-through", color: "text.secondary", fontSize: "0.75rem" }}
                >
                  UGX {(item.price / (1 - item.discount / 100)).toLocaleString()}
                </Typography>
              )}
              <Typography variant="h6" color="primary" fontWeight="bold">
                UGX {item.price.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.4,
            }}
          >
            {item.descriptions || "No description available"}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Rating value={item.avg_rating || 0} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {(item.avg_rating || 0).toFixed(1)}/5
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant={isAdded ? "outlined" : "contained"}
            color={isAdded ? "success" : "primary"}
            startIcon={isAdded ? <Check /> : <ShoppingCart />}
            onClick={() => onAddToCart(item)}
            disabled={isAdded || item.is_available === false}
            sx={{ py: 1, fontWeight: "bold", transition: "all 0.3s ease" }}
          >
            {item.is_available === false ? "Out of Stock" : isAdded ? "Added to Cart" : "Add to Cart"}
          </Button>
        </CardActions>
      </Card>
    </Fade>
  )
}

// Loading Skeleton Component
const FoodItemSkeleton = () => (
  <Card sx={{ height: "100%" }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" height={32} width="80%" />
      <Skeleton variant="text" height={24} width="60%" />
      <Skeleton variant="text" height={20} width="100%" />
      <Skeleton variant="text" height={20} width="100%" />
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Skeleton variant="rectangular" width={100} height={20} />
        <Skeleton variant="text" width={40} sx={{ ml: 1 }} />
      </Box>
    </CardContent>
    <CardActions sx={{ p: 2 }}>
      <Skeleton variant="rectangular" width="100%" height={36} />
    </CardActions>
  </Card>
)

function EnhancedMenuDisplay() {
  const theme = useTheme()
  const axiosInstance = useAxios()
  const [food, setFood] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [addedItems, setAddedItems] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [currentTab, setCurrentTab] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const { handleCart, addItem } = useContext(AuthContext)

  const foodUrl = "https://restaurant-backend5.onrender.com/restaurant/food_items"

  const categories = [
    { label: "All Items", value: "all", icon: <Restaurant /> },
    { label: "Breakfast", value: "breakfast", icon: <WbSunny /> },
    { label: "Lunch", value: "lunch", icon: <LunchDining /> },
    { label: "Dinner", value: "dinner", icon: <DinnerDining /> },
  ]

  const fetchFood = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(foodUrl)
        setFood(response.data)
        // setFood(mockFoodData)
        setLoading(false)
    } catch (error) {
      console.error("Error fetching food items:", error)
      setSnackbarMessage("Failed to load menu items")
      setSnackbarOpen(true)
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
    // Smooth scroll to top of menu section
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleAddToCart = (item) => {
    handleCart(item)
    setAddedItems([...addedItems, item.id])
    setSnackbarMessage(`${item.name} added to cart!`)
    setSnackbarOpen(true)
  }

  // Filter items based on current tab and search
  const getFilteredItems = () => {
    let filtered = food

    // Filter by category
    if (currentTab > 0) {
      const selectedCategory = categories[currentTab].value
      filtered = filtered.filter((item) => item.category__name === selectedCategory)
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    return filtered
  }

  // Get paginated items
  const getPaginatedItems = () => {
    const filteredItems = getFilteredItems()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredItems.slice(startIndex, endIndex)
  }

  const filteredFood = getFilteredItems()
  const paginatedFood = getPaginatedItems()
  const totalPages = Math.ceil(filteredFood.length / itemsPerPage)

  useEffect(() => {
    fetchFood()
    
  }, [])

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header Section */}
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
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Our Delicious Menu
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Discover amazing flavors crafted with love and the finest ingredients
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <TextField
              placeholder="Search for your favorite dish..."
              value={search}
              onChange={handleSearch}
              sx={{
                maxWidth: 500,
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& .MuiInputBase-input": {
                  color: "white",
                  "&::placeholder": { color: "rgba(255,255,255,0.7)" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>

        {/* Category Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="menu categories"
            sx={{
              "& .MuiTab-root": {
                minHeight: 72,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
              },
            }}
          >
            {categories.map((category, index) => (
              <Tab
                key={category.value}
                icon={category.icon}
                label={category.label}
                iconPosition="start"
                aria-label={`${category.label} category`}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Stats and Cart */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FilterList color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {search
                ? `Search Results (${filteredFood.length})`
                : `${categories[currentTab].label} (${filteredFood.length})`}
            </Typography>
            {search && (
              <Chip
                label={`"${search}"`}
                onDelete={() => {
                  setSearch("")
                  setCurrentPage(1)
                }}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>

          <Badge badgeContent={addItem.length} color="primary">
            <Tooltip title="View Cart">
              <IconButton
                component={Link}
                to="/customer/dashboard/cart"
                aria-label="View shopping cart"
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <ShoppingCart />
              </IconButton>
            </Tooltip>
          </Badge>
        </Box>

        {/* Tab Panels */}
        {categories.map((category, index) => (
          <TabPanel key={category.value} value={currentTab} index={index}>
            {loading ? (
              <Grid container spacing={3}>
                {Array.from({ length: itemsPerPage }).map((_, skeletonIndex) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={skeletonIndex}>
                    <FoodItemSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : paginatedFood.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: "center" }}>
                <Restaurant sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  No items found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {search
                    ? `No results for "${search}" in ${category.label.toLowerCase()}`
                    : `No ${category.label.toLowerCase()} items available at the moment`}
                </Typography>
                {search && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearch("")
                      setCurrentPage(1)
                    }}
                    sx={{ mt: 2 }}
                  >
                    Clear Search
                  </Button>
                )}
              </Paper>
            ) : (
              <>
                <Grid container spacing={3}>
                  {paginatedFood.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                      <FoodItemCard item={item} isAdded={addedItems.includes(item.id)} onAddToCart={handleAddToCart} />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                    <Stack spacing={2} alignItems="center">
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                          "& .MuiPaginationItem-root": {
                            fontSize: "1rem",
                            fontWeight: 500,
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Showing {(currentPage - 1) * itemsPerPage + 1}-
                        {Math.min(currentPage * itemsPerPage, filteredFood.length)} of {filteredFood.length} items
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </>
            )}
          </TabPanel>
        ))}
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

export default EnhancedMenuDisplay