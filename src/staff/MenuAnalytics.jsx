import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Chip,
  Rating,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Alert,
  Stack,
  Avatar,
  Button
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Restaurant as RestaurantIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  FreeBreakfast as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
} from "@mui/icons-material";
import axios from "axios";

const menuUrl = "http://127.0.0.1:8000/restaurant/food_items";

const menu_stats = "http://127.0.0.1:8000/restaurant/menu_analytics"

const category_count = "http://127.0.0.1:8000/restaurant/category_count"

const top_perfomers = 'http://127.0.0.1:8000/restaurant/top_perfomers'

const needs_attension = 'http://127.0.0.1:8000/restaurant/needs_attention'

function categorizeFoodItem(item) {
  if (item.category__name) return item.category__name.toLowerCase();

  const name = item.name ? item.name.toLowerCase() : "";
  const desc = item.descriptions ? item.descriptions.toLowerCase() : "";
  const text = `${name} ${desc}`;

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
    return "breakfast";
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
    return "dinner";
  }

  return "lunch";
}

function MenuAnalytics() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [menuItems, setMenuItems] = useState([]);
  const [stats, setStats] = useState('')
  const [cat_stats, setCat_stats] = useState('')
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");

  const [top, setTop] = useState([])
  const [attension, setAttention] = useState([])

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(menuUrl);
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format: Expected an array of menu items");
      }
      const data = response.data.map((item) => ({
        ...item,
        category: categorizeFoodItem(item),
      }));
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to load menu items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const name = item.name ? item.name.toLowerCase() : "";
    const price = item.price ? item.price.toString() : "";
    const category = categorizeFoodItem(item).toLowerCase();
    const search = searchText.toLowerCase();
    return name.includes(search) || price.includes(search) || category.includes(search);
  });

  // menu stats
 const getMenuStats = async()=>{
  try{
    const response = await axios.get(menu_stats)
    const count_response = await axios.get(category_count)
    const data = response.data
    setStats(data)
    setCat_stats(count_response.data)
  }catch(err){
    console.log('err', err)
  }
 }

//  top perfomers
const topPerfomers = async()=>{
  try{
   const response = await axios.get(top_perfomers)
   const data = response.data
   setTop(data)
  }catch(err){
    console.log('err', err)
  }
}

// needs attension
const needsAttention = async()=>{
  try{
    const response = await axios.get(needs_attension)
    const data = response.data
    setAttention(data)
  }catch(err){
    console.log('err', err)
  }
}

  const categoryConfig = {
    breakfast: { icon: <BreakfastIcon />, label: "Breakfast", color: "#FF9800" },
    lunch: { icon: <LunchIcon />, label: "Lunch", color: "#4CAF50" },
    dinner: { icon: <DinnerIcon />, label: "Dinner", color: "#9C27B0" },
  };

  const columns = [
    {
      field: "name",
      headerName: "Product Name",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => {
        const category = categorizeFoodItem(params.row);
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1 }}>
            <Avatar
              src={params.row.image || "/placeholder.svg"}
              alt={params.value || "Unknown"}
              sx={{ width: 50, height: 50 }}
              variant="rounded"
            />
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {params.value || "Unknown"}
              </Typography>
              <Chip
                icon={categoryConfig[category]?.icon || <RestaurantIcon />}
                label={categoryConfig[category]?.label || "Unknown"}
                size="small"
                sx={{
                  bgcolor: categoryConfig[category]?.color || "grey.500",
                  color: "white",
                  fontSize: "0.7rem",
                  height: "20px",
                }}
              />
            </Box>
          </Box>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MoneyIcon fontSize="small" color="success" />
          <Chip
            label={params.value ? `UGX ${params.value.toLocaleString()}` : "N/A"}
            color="success"
            variant="outlined"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        </Box>
      ),
    },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
          <Avatar
            src={`http://127.0.0.1:8000/media/${params.value}` || "/placeholder.svg"}
            alt="Product"
            sx={{
              width: 60,
              height: 60,
              border: "2px solid",
              borderColor: "primary.main",
            }}
            variant="rounded"
          />
        </Box>
      ),
    },
    {
      field: "avg_rating",
      headerName: "Average Rating",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Rating value={params.value || 0} readOnly size="small" precision={0.1} />
          <Typography variant="body2" fontWeight="bold" color="primary">
            {(params.value || 0).toFixed(1)}
          </Typography>
        </Box>
      ),
    },
  ];

  useEffect(() => {
     const loadData = async()=>{
    await Promise.all(getMenuStats(), topPerfomers(), needsAttention(),  fetchData())
  }
   loadData()
   
  }, []);

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button onClick={fetchData} variant="contained">
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: "info.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AssessmentIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                Menu Analytics
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Analyze menu performance, ratings, and pricing insights
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Statistics Dashboard */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2, bgcolor: "primary.main", color: "white" }}>
              <RestaurantIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.total_items}
              </Typography>
              <Typography variant="body2">Total Items</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2, bgcolor: "success.main", color: "white" }}>
              <MoneyIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                UGX {stats.avg_price}
              </Typography>
              <Typography variant="body2">Average Price</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2, bgcolor: "warning.main", color: "white" }}>
              <StarIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.total_average_rating}
              </Typography>
              <Typography variant="body2">Average Rating</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2, bgcolor: "secondary.main", color: "white" }}>
              <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.highest_rate}
              </Typography>
              <Typography variant="body2">High Rated (4+)</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Category Breakdown */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RestaurantIcon />
            Category Breakdown
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(cat_stats).map((cats) => {
              const config = { icon: <RestaurantIcon />, label: cats, color: "grey.500" };
              return (
                <Grid item xs={12} sm={4} key={cats}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: config.color,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    {config.icon}
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                          {cat_stats[cats]}
                      </Typography>
                      <Typography variant="body2">{config.label}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        {/* Search */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search menu items by name, price, or category..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Menu Items Table */}
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <DataGrid
              rows={filteredItems}
              columns={columns}
              loading={loading}
              pageSizeOptions={[10, 25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: "grey.50",
                  borderBottom: "2px solid",
                  borderColor: "divider",
                },
                "& .MuiDataGrid-row": {
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                  "& .MuiDataGrid-cell": {
                    py: 0,
                  },
                },
                minHeight: 400,
              }}
              getRowHeight={() => 80}
              disableRowSelectionOnClick
            />
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUpIcon />
            Performance Insights
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                  Top Performers
                </Typography>
                {top.length === 0 ? ( <Chip
                                      label="No Ratings Yet"
                                      color="success"
                                      size="small"
                                      sx={{ minWidth: "40px", fontWeight: "bold" }}
                                    />) : (
                  <>
                  {top.map((item, index) => (
                    <Box key={item.id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip
                        label={`#${index + 1}`}
                        color="success"
                        size="small"
                        sx={{ minWidth: "40px", fontWeight: "bold" }}
                      />
                      <Avatar
                        src={item.image || "/placeholder.svg"}
                        alt={item.name || "Unknown"}
                        sx={{ width: 30, height: 30 }}
                      />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {item.name || "Unknown"}
                      </Typography>
                      <Rating value={item.avg_rating || 0} readOnly size="small" />
                      <Typography variant="body2" fontWeight="bold">
                        {(item.avg_rating || 0).toFixed(1)}
                      </Typography>
                    </Box>
                  ))}
                  </>
                )}
                
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                  Needs Attention
                </Typography>
                {attension.length === 0 ? ( <Chip
                                          label="No Ratings Yet"
                                          color="warning"
                                          size="small"
                                          sx={{ minWidth: "40px", fontWeight: "bold" }}
                                        />) : (<>
                                        {attension.map((item, index) => (
                    <Box key={item.id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip label={`⚠️`} color="warning" size="small" sx={{ minWidth: "40px", fontWeight: "bold" }} />
                      <Avatar
                        src={item.image || "/placeholder.svg"}
                        alt={item.name || "Unknown"}
                        sx={{ width: 30, height: 30 }}
                      />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {item.name || "Unknown"}
                      </Typography>
                      <Rating value={item.avg_rating || 0} readOnly size="small" />
                      <Typography variant="body2" fontWeight="bold">
                        {(item.avg_rating || 0).toFixed(1)}
                      </Typography>
                    </Box>
                  ))}
                </>)}
                
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default MenuAnalytics;