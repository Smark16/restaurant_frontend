"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
  Avatar,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Stack,
} from "@mui/material"
import {
  CloudUpload as CloudUploadIcon,
  Restaurant as RestaurantIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  FreeBreakfast as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
  Add as AddIcon,
  LocalDining as IngredientsIcon,
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"

const url = "http://127.0.0.1:8000/restaurant/items"

function AddItem() {
  const navigate = useNavigate()
  const [product, setProduct] = useState({
    pname: "",
    price: "",
    desc: "",
    image: null,
    category: "",
    ingredients: [], // Added ingredients field
  })
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [currentIngredient, setCurrentIngredient] = useState("") // For ingredient input

  const categories = [
    { id: 1, value: "breakfast", label: "Breakfast", icon: <BreakfastIcon />, color: "#FF9800" },
    { id: 2, value: "lunch", label: "Lunch", icon: <LunchIcon />, color: "#4CAF50" },
    { id: 3, value: "dinner", label: "Dinner", icon: <DinnerIcon />, color: "#9C27B0" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleCategoryChange = (e) => {
    setProduct({ ...product, category: e.target.value })
    if (errors.category) {
      setErrors({ ...errors, category: "" })
    }
  }

  // Handle adding ingredients
  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !product.ingredients.includes(currentIngredient.trim())) {
      setProduct({
        ...product,
        ingredients: [...product.ingredients, currentIngredient.trim()],
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
    setProduct({
      ...product,
      ingredients: product.ingredients.filter((ingredient) => ingredient !== ingredientToRemove),
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
      setProduct({ ...product, image: selectedFile })
      setImagePreview(URL.createObjectURL(selectedFile))
      // Clear image error
      if (errors.image) {
        setErrors({ ...errors, image: "" })
      }
    }
  }

  const removeImage = () => {
    setProduct({ ...product, image: null })
    setImagePreview("")
    // Reset file input
    const fileInput = document.getElementById("image-upload")
    if (fileInput) fileInput.value = ""
  }

  const validateForm = () => {
    const newErrors = {}
    if (!product.pname.trim()) {
      newErrors.pname = "Product name is required"
    }
    if (!product.price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(product.price)) || Number(product.price) <= 0) {
      newErrors.price = "Please enter a valid price"
    }
    if (!product.desc.trim()) {
      newErrors.desc = "Description is required"
    } else if (product.desc.trim().length < 10) {
      newErrors.desc = "Description should be at least 10 characters"
    }
    if (!product.category) {
      newErrors.category = "Please select a category"
    }
    if (!product.image) {
      newErrors.image = "Please upload an image"
    }
    if (product.ingredients.length === 0) {
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

    setLoading(true)
    const formData = new FormData()
    formData.append("name", product.pname)
    formData.append("price", product.price)
    formData.append("descriptions", product.desc)
    formData.append("category", product.category)
    formData.append("ingredients", JSON.stringify(product.ingredients)) // Send ingredients as JSON string
    if (product.image) {
      formData.append("image", product.image)
    }

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      if (response.status === 201) {
        setSuccessAlert("Item Added Successfully")
        // Reset form
        setProduct({ pname: "", price: "", desc: "", image: null, category: "", ingredients: [] })
        setImagePreview("")
        setCurrentIngredient("")
        setTimeout(() => {
          navigate("/staff/dashboard/menu")
        }, 1500)
      } else {
        setErrorAlert("An Error Occurred")
      }
    } catch (err) {
      console.error(err)
      setErrorAlert("Failed to add item. Please try again.")
    } finally {
      setLoading(false)
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
      showConfirmButton: true,
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
      showConfirmButton: true,
    })
  }

  const selectedCategory = categories.find((cat) => cat.value === product.category)

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: "success.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton component={Link} to="/staff/dashboard/menu" sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>
            <RestaurantIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
              Add New Menu Item
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
            Create a new delicious item for your restaurant menu
          </Typography>
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
                    name="pname"
                    value={product.pname}
                    onChange={handleChange}
                    error={!!errors.pname}
                    helperText={errors.pname}
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
                    value={product.price}
                    onChange={handleChange}
                    error={!!errors.price}
                    helperText={errors.price}
                    placeholder="Enter price"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">UGX</InputAdornment>,
                    }}
                  />
                </Grid>

                {/* Category */}
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select value={product.category} label="Category" onChange={handleCategoryChange}>
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
                  {product.ingredients.length > 0 && (
                    <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Current Ingredients ({product.ingredients.length}):
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {product.ingredients.map((ingredient, index) => (
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
                    name="desc"
                    multiline
                    rows={4}
                    value={product.desc}
                    onChange={handleChange}
                    error={!!errors.desc}
                    helperText={errors.desc || `${product.desc.length}/500 characters`}
                    placeholder="Describe your delicious item in detail..."
                    inputProps={{ maxLength: 500 }}
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PhotoCameraIcon />
                    Upload Image
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
                    {!imagePreview ? (
                      <Box>
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="image-upload"
                          type="file"
                          onChange={handleImageChange}
                        />
                        <label htmlFor="image-upload">
                          <IconButton color="primary" aria-label="upload picture" component="span" sx={{ mb: 2 }}>
                            <Avatar sx={{ width: 60, height: 60, bgcolor: "primary.main" }}>
                              <CloudUploadIcon sx={{ fontSize: 30 }} />
                            </Avatar>
                          </IconButton>
                        </label>
                        <Typography variant="h6" gutterBottom>
                          Click to upload image
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Supports: JPG, JPEG, PNG (Max 5MB)
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Box sx={{ position: "relative", display: "inline-block" }}>
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
                          <IconButton
                            onClick={removeImage}
                            sx={{
                              position: "absolute",
                              top: -10,
                              right: -10,
                              bgcolor: "error.main",
                              color: "white",
                              "&:hover": { bgcolor: "error.dark" },
                            }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Image uploaded successfully
                        </Typography>
                      </Box>
                    )}
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
                      to="/staff/dashboard/menu"
                      variant="outlined"
                      size="large"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={loading}
                      sx={{
                        minWidth: 150,
                        bgcolor: "success.main",
                        "&:hover": { bgcolor: "success.dark" },
                      }}
                    >
                      {loading ? "Saving..." : "Save Item"}
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

export default AddItem
