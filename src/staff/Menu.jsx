import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Container,
  Pagination,
  Chip,
  Skeleton,
  AppBar,
  Toolbar,
  Fab,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Restaurant as RestaurantIcon,
  LunchDining as LunchIcon,
  FreeBreakfast as BreakfastIcon,
  DinnerDining as DinnerIcon,
  RestaurantMenu as AllIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import useAxios from "../components/useAxios";

const foodUrl = "https://restaurant-backend5.onrender.com/restaurant/food_items";

// Function to categorize food items based on name/description if category is not provided
const categorizeFoodItem = (item) => {
  if (item.category__name) return item.category__name.toLowerCase();

  // const name = item.name.toLowerCase();
  // const desc = item.descriptions.toLowerCase();
  // const text = `${name} ${desc}`;

  // // Breakfast keywords
  // if (
  //   text.includes("breakfast") ||
  //   text.includes("cereal") ||
  //   text.includes("pancake") ||
  //   text.includes("toast") ||
  //   text.includes("egg") ||
  //   text.includes("coffee") ||
  //   text.includes("tea") ||
  //   text.includes("juice") ||
  //   text.includes("croissant") ||
  //   text.includes("bagel") ||
  //   text.includes("oatmeal") ||
  //   text.includes("yogurt")
  // ) {
  //   return "breakfast";
  // }

  // // Dinner keywords
  // if (
  //   text.includes("dinner") ||
  //   text.includes("steak") ||
  //   text.includes("wine") ||
  //   text.includes("roast") ||
  //   text.includes("grilled") ||
  //   text.includes("pasta") ||
  //   text.includes("salmon") ||
  //   text.includes("chicken breast") ||
  //   text.includes("lamb") ||
  //   text.includes("seafood") ||
  //   text.includes("risotto")
  // ) {
  //   return "dinner";
  // }

  // // Default to lunch for everything else
  // return "lunch";
};

function Menu() {
  const axiosInstance = useAxios()
  const {food, setFood} = useContext(AuthContext)
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredFood, setFilteredFood] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const itemsPerPage = 8;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchFood = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(foodUrl);
      const data = response.data.map((item) => ({
        ...item,
        category: categorizeFoodItem(item),
      }));
      setFood(data);
      setFilteredFood(data);
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    applyFilters(searchValue, selectedCategory);
  };

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
      setCurrentPage(1);
      applyFilters(search, newCategory);
    }
  };

  const applyFilters = (searchValue, category) => {
    let filtered = food;

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter((item) => categorizeFoodItem(item) === category);
    }

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.descriptions.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }

    setFilteredFood(filtered);
  };

  useEffect(() => {
    fetchFood();
  }, []);

  useEffect(() => {
    applyFilters(search, selectedCategory);
  }, [food]);

  // Get counts for each category
  const getCategoryCounts = () => {
    const counts = {
      all: food.length,
      breakfast: food.filter((item) => categorizeFoodItem(item) === "breakfast").length,
      lunch: food.filter((item) => categorizeFoodItem(item) === "lunch").length,
      dinner: food.filter((item) => categorizeFoodItem(item) === "dinner").length,
    };
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  // Pagination logic
  const totalPages = Math.ceil(filteredFood.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredFood.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ height: "100%" }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={24} />
              <Skeleton variant="text" height={20} width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const categoryConfig = {
    all: { icon: <AllIcon />, label: "All Items", color: "primary" },
    breakfast: { icon: <BreakfastIcon />, label: "Breakfast", color: "warning" },
    lunch: { icon: <LunchIcon />, label: "Lunch", color: "success" },
    dinner: { icon: <DinnerIcon />, label: "Dinner", color: "secondary" },
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }} className='mt-4'>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "success.main", mb: 3 }}>
        <Toolbar>
          <RestaurantIcon sx={{ mr: 2 }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Menu
          </Typography>
          {!isMobile && (
            <TextField
              placeholder="Search menu items..."
              value={search}
              onChange={handleSearch}
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { border: "none" },
                  "&:hover fieldset": { border: "none" },
                  "&.Mui-focused fieldset": { border: "1px solid rgba(255, 255, 255, 0.5)" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.7)",
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        {/* Mobile Search */}
        {isMobile && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search menu items..."
              value={search}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        )}

        {/* Category Toggle Buttons */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Meal Categories
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <ToggleButtonGroup
              value={selectedCategory}
              exclusive
              onChange={handleCategoryChange}
              aria-label="meal category"
              sx={{
                flexWrap: "wrap",
                gap: 1,
                "& .MuiToggleButton-root": {
                  border: "1px solid",
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  textTransform: "none",
                  fontWeight: "medium",
                  "&.Mui-selected": {
                    fontWeight: "bold",
                  },
                },
              }}
            >
              {Object.entries(categoryConfig).map(([key, config]) => (
                <ToggleButton
                  key={key}
                  value={key}
                  color={config.color}
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    gap: 1,
                    minWidth: { xs: "80px", sm: "120px" },
                  }}
                >
                  <Badge
                    badgeContent={categoryCounts[key]}
                    color={config.color}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.75rem",
                        minWidth: "18px",
                        height: "18px",
                      },
                    }}
                  >
                    {config.icon}
                  </Badge>
                  {!isMobile && (
                    <Typography variant="body2" component="span">
                      {config.label}
                    </Typography>
                  )}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Paper>

        {/* Stats and Add Button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {selectedCategory === "all" ? "All Menu Items" : `${categoryConfig[selectedCategory].label} Menu`}
            </Typography>
            <Chip
              label={`${filteredFood.length} items found`}
              color={selectedCategory === "all" ? "primary" : categoryConfig[selectedCategory].color}
              variant="outlined"
            />
          </Box>
          <Button
            component={Link}
            to="/staff/dashboard/addItem"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Add Item
          </Button>
        </Box>

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Menu Items Grid */}
        {!loading && (
          <>
            <Grid container spacing={3}>
              {currentItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", flexGrow: 1 }}>
                          {item.name}
                        </Typography>
                        <Chip
                          label={`UGX ${item.price.toLocaleString()}`}
                          color="success"
                          size="small"
                          sx={{ ml: 1, fontWeight: "bold" }}
                        />
                      </Box>

                      {/* Category Badge */}
                      <Box sx={{ mb: 1 }}>
                        <Chip
                          icon={categoryConfig[categorizeFoodItem(item)]?.icon}
                          label={categoryConfig[categorizeFoodItem(item)]?.label}
                          size="small"
                          color={categoryConfig[categorizeFoodItem(item)]?.color}
                          variant="outlined"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          flexGrow: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          mb: 2,
                        }}
                      >
                        {item.descriptions}
                      </Typography>
                      <Button
                        component={Link}
                        to={`/staff/dashboard/items/${item.id}`}
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        fullWidth
                        sx={{ mt: "auto" }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* No Results */}
            {filteredFood.length === 0 && !loading && (
              <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
                <RestaurantIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No menu items found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {search
                    ? `No items match "${search}" in ${selectedCategory === "all" ? "any category" : categoryConfig[selectedCategory].label.toLowerCase()}`
                    : `No ${selectedCategory === "all" ? "" : categoryConfig[selectedCategory].label.toLowerCase()} items available at the moment`}
                </Typography>
              </Paper>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
                <Stack spacing={2} alignItems="center">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    showFirstButton
                    showLastButton
                  />
                  <Typography variant="body2" color="text.secondary">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredFood.length)} of {filteredFood.length} items
                  </Typography>
                </Stack>
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          component={Link}
          to="/staff/dashboard/addItem"
          color="primary"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}

export default Menu;