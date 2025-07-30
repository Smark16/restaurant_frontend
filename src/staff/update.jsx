"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Stack,
  Breadcrumbs,
  Skeleton,
} from "@mui/material"
import {
  Restaurant as RestaurantIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  FreeBreakfast as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
  AttachMoney as MoneyIcon,
  NavigateNext as NavigateNextIcon,
  Edit as EditIcon,
  Add as AddIcon,
  LocalDining as IngredientsIcon,
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"

// Function to categorize food items (same as other components)
const categorizeFoodItem = (item) => {
  const name = item.name.toLowerCase()
  const desc = item.descriptions.toLowerCase()
  const text = `${name} ${desc}`
  if (
    text.includes("breakfast") ||
    text.includes("cereal") ||
    text.includes("pancake") ||
    text.includes("toast") ||
    text.includes("egg") ||
    text.includes("coffee") ||
    text.includes("tea") ||
    text.includes("juice") ||
    text.includes("croissant") ||
    text.includes("bagel") ||
    text.includes("oatmeal") ||
    text.includes("yogurt")
  ) {
    return "breakfast"
  }
  if (
    text.includes("dinner") ||
    text.includes("steak") ||
    text.includes("wine") ||
    text.includes("roast") ||
    text.includes("grilled") ||
    text.includes("pasta") ||
    text.includes("salmon") ||
    text.includes("chicken breast") ||
    text.includes("lamb") ||
    text.includes("seafood") ||
    text.includes("risotto")
  ) {
    return "dinner"
  }
  return "lunch"
}

function UpdateItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState({
    name: "",
    price: "",
    descriptions: "",
    image: null,
    category: "",
    ingredients: [], // Added ingredients field
  })
  const [originalImage, setOriginalImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [currentIngredient, setCurrentIngredient] = useState("") // For ingredient input

  const singleUrl = `https://restaurant-backend5.onrender.com/restaurant/food_items/${id}`
  const updateUrl = `https://restaurant-backend5.onrender.com/restaurant/update_menu/${id}`

  const categories = [
    { id: 1, value: "breakfast", label: "Breakfast", icon: <BreakfastIcon />, color: "#FF9800" },
    { id: 2, value: "lunch", label: "Lunch", icon: <LunchIcon />, color: "#4CAF50" },
    { id: 3, value: "dinner", label: "Dinner", icon: <DinnerIcon />, color: "#9C27B0" },
  ]

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(singleUrl)
      const data = response.data

      setOriginalImage(data.image)
      // Auto-categorize if no category exists
      const category = data.category || categorizeFoodItem(data)

      // Parse ingredients if they exist, otherwise use empty array
      let ingredients = []
      if (data.ingredients) {
        try {
          ingredients =
            typeof data.ingredients === "string"
              ? JSON.parse(data.ingredients)
              : Array.isArray(data.ingredients)
                ? data.ingredients
                : []
        } catch (e) {
          console.warn("Failed to parse ingredients:", e)
          ingredients = []
        }
      }

      setItem({
        name: data.name || "",
        price: data.price?.toString() || "",
        descriptions: data.descriptions || "",
        image: data.image,
        category: category,
        ingredients: ingredients,
      })
    } catch (err) {
      console.error(err)
      Swal.fire({
        title: "Error loading item",
        text: "Failed to load item details. Please try again.",
        icon: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setItem({ ...item, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleCategoryChange = (e) => {
    setItem({ ...item, category: e.target.value })
    if (errors.category) {
      setErrors({ ...errors, category: "" })
    }
  }

  // Handle adding ingredients
  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !item.ingredients.includes(currentIngredient.trim())) {
      setItem({
        ...item,
        ingredients: [...item.ingredients, currentIngredient.trim()],
      })
      setCurrentIngredient("")
      // Clear ingredients error
      if (errors.ingredients) {
        setErrors({ ...errors, ingredients: "" })
      }
    }
  }

  // Handle removing ingredients
  const handleRemoveIngredient = (ingredientToRemove) => {
    setItem({
      ...item,
      ingredients: item.ingredients.filter((ingredient) => ingredient !== ingredientToRemove),
    })
  }

  // Handle Enter key press for adding ingredients
  const handleIngredientKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddIngredient()
    }
  }

  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Please select a valid image file" })
        return
      }
      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" })
        return
      }
      setItem({ ...item, image: selectedFile })
      setImagePreview(URL.createObjectURL(selectedFile))
      // Clear image error
      if (errors.image) {
        setErrors({ ...errors, image: "" })
      }
    }
  }

  const removeImage = () => {
    setItem({ ...item, image: originalImage })
    setImagePreview(originalImage)
    // Reset file input
    const fileInput = document.getElementById("image-upload")
    if (fileInput) fileInput.value = ""
  }

  const validateForm = () => {
    const newErrors = {}
    if (!item.name.trim()) {
      newErrors.name = "Product name is required"
    }
    if (!item.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(item.price)) || Number(item.price) <= 0) {
      newErrors.price = "Please enter a valid price"
    }
    if (!item.descriptions.trim()) {
      newErrors.descriptions = "Description is required"
    } else if (item.descriptions.trim().length < 10) {
      newErrors.descriptions = "Description should be at least 10 characters"
    }
    if (!item.category) {
      newErrors.category = "Please select a category"
    }
    if (item.ingredients.length === 0) {
      newErrors.ingredients = "Please add at least one ingredient"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", item.name)
      formData.append("price", item.price)
      formData.append("descriptions", item.descriptions)
      formData.append("category", item.category)
      formData.append("ingredients", JSON.stringify(item.ingredients)) // Send ingredients as JSON string

      // Handle image
      if (item.image instanceof File) {
        // New image uploaded
        formData.append("image", item.image)
      }

      const response = await axios.put(updateUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200 || response.status === 201) {
        setSuccessAlert("Item Updated Successfully")
        setTimeout(() => {
          navigate(`/staff/dashboard/items/${id}`)
        }, 1500)
      } else {
        setErrorAlert("An Error Occurred")
      }
    } catch (err) {
      console.error(err)
      setErrorAlert("Failed to update item. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const setSuccessAlert = (message) => {
    Swal.fire({
      title: message,
      icon: "success",
      timer: 6000,
      toast: true,
      position: "top",
      timerProgressBar: true,
      showConfirmButton: false,
    })
  }

  const setErrorAlert = (message) => {
    Swal.fire({
      title: message,
      icon: "error",
      toast: true,
      timer: 6000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    })
  }

  const selectedCategory = categories.find((cat) => cat.value === item.category)

  if (loading) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
        <Container maxWidth="md">
          <Skeleton variant="rectangular" height={80} sx={{ mb: 3 }} />
          <Card sx={{ boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={120} />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="md">
        {/* Breadcrumbs */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link to="/staff/dashboard/menu" style={{ textDecoration: "none", color: "inherit" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <RestaurantIcon fontSize="small" />
                Menu
              </Box>
            </Link>
            <Link to={`/staff/dashboard/items/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
              {item.name || "Item Details"}
            </Link>
            <Typography color="text.primary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EditIcon fontSize="small" />
              Edit Item
            </Typography>
          </Breadcrumbs>
        </Paper>

        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: "warning.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton component={Link} to={`/staff/dashboard/items/${id}`} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>
            <EditIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                Edit Menu Item
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Update the details of "{item.name}"
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Form */}
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Product Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    name="name"
                    value={item.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    placeholder="Enter delicious item name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RestaurantIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Price */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price (UGX)"
                    name="price"
                    type="number"
                    value={item.price}
                    onChange={handleChange}
                    error={!!errors.price}
                    helperText={errors.price}
                    placeholder="Enter price"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MoneyIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Category */}
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select value={item.category} label="Category" onChange={handleCategoryChange}>
                      {categories.map((category) => (
                        <MenuItem key={category.value} value={category.id}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {category.icon}
                            <Typography>{category.label}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.category}
                      </Typography>
                    )}
                  </FormControl>
                  {selectedCategory && (
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        icon={selectedCategory.icon}
                        label={selectedCategory.label}
                        sx={{ bgcolor: selectedCategory.color, color: "white" }}
                      />
                    </Box>
                  )}
                </Grid>

                {/* Ingredients */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IngredientsIcon />
                    Ingredients
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add Ingredient"
                      value={currentIngredient}
                      onChange={(e) => setCurrentIngredient(e.target.value)}
                      onKeyPress={handleIngredientKeyPress}
                      placeholder="e.g., salt, tomatoes, onions"
                      error={!!errors.ingredients}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IngredientsIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddIngredient}
                      disabled={!currentIngredient.trim()}
                      sx={{ minWidth: 100 }}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Box>

                  {/* Display current ingredients */}
                  {item.ingredients.length > 0 && (
                    <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Current Ingredients ({item.ingredients.length}):
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {item.ingredients.map((ingredient, index) => (
                          <Chip
                            key={index}
                            label={ingredient}
                            onDelete={() => handleRemoveIngredient(ingredient)}
                            color="primary"
                            variant="outlined"
                            deleteIcon={<DeleteIcon />}
                          />
                        ))}
                      </Box>
                    </Paper>
                  )}

                  {errors.ingredients && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {errors.ingredients}
                    </Alert>
                  )}

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                    Add ingredients one by one. Press Enter or click Add button to add each ingredient.
                  </Typography>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="descriptions"
                    multiline
                    rows={4}
                    value={item.descriptions}
                    onChange={handleChange}
                    error={!!errors.descriptions}
                    helperText={errors.descriptions || `${item.descriptions.length}/500 characters`}
                    placeholder="Describe your delicious item in detail..."
                    inputProps={{ maxLength: 500 }}
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PhotoCameraIcon />
                    Update Image
                  </Typography>
                  <Paper
                    sx={{
                      p: 3,
                      border: errors.image ? "2px dashed #f44336" : "2px dashed #ccc",
                      borderRadius: 2,
                      textAlign: "center",
                      bgcolor: "background.paper",
                      transition: "border-color 0.3s ease",
                      "&:hover": {
                        borderColor: errors.image ? "#f44336" : "primary.main",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      {imagePreview ? (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "300px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      ) : originalImage ? (
                        <img
                          src={originalImage}
                          alt="Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "300px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                      ) : (
                        <p>No Image selected</p>
                      )}

                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="image-upload"
                        type="file"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="image-upload">
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          sx={{
                            position: "absolute",
                            bottom: -10,
                            right: -10,
                            bgcolor: "primary.main",
                            color: "white",
                            "&:hover": { bgcolor: "primary.dark" },
                          }}
                        >
                          <PhotoCameraIcon />
                        </IconButton>
                      </label>
                      {imagePreview !== originalImage && (
                        <IconButton
                          onClick={removeImage}
                          sx={{
                            position: "absolute",
                            top: -10,
                            left: -10,
                            bgcolor: "error.main",
                            color: "white",
                            "&:hover": { bgcolor: "error.dark" },
                          }}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Click the camera icon to change image
                    </Typography>
                  </Paper>
                  {errors.image && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {errors.image}
                    </Alert>
                  )}
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      component={Link}
                      to={`/staff/dashboard/items/${id}`}
                      variant="outlined"
                      size="large"
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={submitting}
                      sx={{
                        minWidth: 150,
                        bgcolor: "warning.main",
                        "&:hover": { bgcolor: "warning.dark" },
                      }}
                    >
                      {submitting ? "Updating..." : "Update Item"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default UpdateItem
