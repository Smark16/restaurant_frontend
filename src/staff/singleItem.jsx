import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  Grid,
  Chip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Breadcrumbs,
  IconButton,
  Divider,
  Stack,
  Alert,
  useTheme,
  useMediaQuery,
  Switch,
  ListItemSecondaryAction,
  ListItem
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  FavoriteOutlined as FavoriteIcon,
  Restaurant as RestaurantIcon,
  AttachMoney as MoneyIcon,
  FreeBreakfast as BreakfastIcon,
  LunchDining as LunchIcon,
  DinnerDining as DinnerIcon,
  NavigateNext as NavigateNextIcon,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

import { Link, useParams, useNavigate } from "react-router-dom";
import useAxios from "../components/useAxios";
import useHook from "./customHook";
import { IndexedData } from "../components/IndexedDB";

const foodUrl = 'https://restaurant-backend5.onrender.com/restaurant/food_items'

// Function to categorize food items (same as in menu component)
const categorizeFoodItem = (item) => {
  console.log('item', item)
  if (item.category?.name) return item.category?.name.toLowerCase();

  const name = item.name.toLowerCase();
  const desc = item.descriptions.toLowerCase();
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
};

function SingleItem() {
  const { getSingleItem } = IndexedData()
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const axiosInstance = useAxios()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const singleUrl = `https://restaurant-backend5.onrender.com/restaurant/food_items/${id}`;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const { foodItems } = useHook(foodUrl);

  useEffect(()=>{
    getSingleItem(id)
    .then(data => setItem(data))
    .catch(err => console.log('indexed bd err', err))
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get(singleUrl);
      const data = response.data;
      setItem(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load item details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDeleting(true);
      await axiosInstance.delete(`https://restaurant-backend5.onrender.com/restaurant/delete_items/${id}`);
      navigate("/staff/dashboard/menu");
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Failed to delete item. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // change availability status
  const changeStatus = async(id, available)=>{
    try{
       const change_status = `https://restaurant-backend5.onrender.com/restaurant/update_availability/${id}`
       const newStatus = !available
       await axiosInstance.patch(change_status, {is_available : newStatus})

       setItem((prev) => prev.id === id ? {...prev, is_available:newStatus} : prev)
    }catch(err){
      console.log('err', err)
    }finally{

    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  const categoryConfig = {
    breakfast: { icon: <BreakfastIcon />, label: "Breakfast", color: "#FF9800" },
    lunch: { icon: <LunchIcon />, label: "Lunch", color: "#4CAF50" },
    dinner: { icon: <DinnerIcon />, label: "Dinner", color: "#9C27B0" },
  };

  const getRelatedItems = () => {
    if (!item || !foodItems?.length) return [];
    const currentCategory = categorizeFoodItem(item);
    return foodItems
      .filter((foodItem) => foodItem.id !== item.id && categorizeFoodItem(foodItem) === currentCategory)
      .slice(0, 4);
  };

  const relatedItems = getRelatedItems();

  if (loading) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={400} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={60} />
              <Skeleton variant="text" height={40} width="60%" />
              <Skeleton variant="rectangular" height={120} sx={{ my: 2 }} />
              <Skeleton variant="text" height={50} width="40%" />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button component={Link} to="/staff/dashboard/menu" startIcon={<ArrowBackIcon />}>
            Back to Menu
          </Button>
        </Container>
      </Box>
    );
  }

  if (!item) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
        <Container maxWidth="lg">
          <Alert severity="warning" sx={{ mb: 3 }}>
            Item not found
          </Alert>
          <Button component={Link} to="/staff/dashboard/menu" startIcon={<ArrowBackIcon />}>
            Back to Menu
          </Button>
        </Container>
      </Box>
    );
  }

  const itemCategory = categorizeFoodItem(item);
  const categoryInfo = categoryConfig[itemCategory];

  console.log('item category',itemCategory, 'categoryInfo', categoryInfo )
  categorizeFoodItem(item)

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link to="/staff/dashboard/menu" style={{ textDecoration: "none", color: theme.palette.primary.main }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <RestaurantIcon fontSize="small" />
                Menu
              </Box>
            </Link>
            <Typography color="text.primary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {categoryInfo?.icon}
              {item.name}
            </Typography>
          </Breadcrumbs>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardMedia
                component="img"
                image={`https://res.cloudinary.com/dnsx36nia/${item.image}`}
                alt={item.name}
                sx={{
                  height: { xs: 300, md: 400 },
                  objectFit: "cover",
                }}
              />
            </Card>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* Header */}
              <Box>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                  {item.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Chip
                    icon={categoryInfo?.icon}
                    label={categoryInfo?.label}
                    sx={{
                      bgcolor: categoryInfo?.color,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                  <Chip
                    icon={<MoneyIcon />}
                    label={`UGX ${item.price.toLocaleString()}`}
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: "bold", fontSize: "1rem" }}
                  />
                </Box>
              </Box>

              {/* Description */}
              <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {item.descriptions}
                </Typography>
              </Paper>

              {/* ingredients */}
              {item.ingredients && (
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
              )}

              {/* item status */}
              <ListItem>
              <Chip
                label={item.is_available ? "Available" : "Out of Stock"}
                color={item.is_available ? "success" : "error"}
                size="small"
                icon={item.is_available ? <Cancel /> : <CheckCircle />}
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={item.is_available}
                  onChange={() => changeStatus(item.id, item.is_available)}
                  color="primary"
                />
              </ListItemSecondaryAction>
                
              </ListItem>

              {/* Action Buttons */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Actions
                </Typography>
                <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                  <Button
                    component={Link}
                    to={`/staff/dashboard/update/${id}`}
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{ flex: 1 }}
                  >
                    Edit Item
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{ flex: 1 }}
                  >
                    Delete Item
                  </Button>
                  <IconButton color="primary" sx={{ display: { xs: "none", md: "flex" } }}>
                    <ShareIcon />
                  </IconButton>
                  <IconButton color="secondary" sx={{ display: { xs: "none", md: "flex" } }}>
                    <FavoriteIcon />
                  </IconButton>
                </Stack>
              </Paper>

              {/* Back Button */}
              <Button
                component={Link}
                to="/staff/dashboard/menu"
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                size="large"
              >
                Back to Menu
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
              More {categoryInfo?.label} Items
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {relatedItems.map((relatedItem) => (
                <Grid item xs={12} sm={6} md={3} key={relatedItem.id}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="150"
                      image={relatedItem.image}
                      alt={relatedItem.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                        {relatedItem.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        UGX {relatedItem.price.toLocaleString()}
                      </Typography>
                      <Button
                        component={Link}
                        to={`/staff/dashboard/items/${relatedItem.id}`}
                        variant="outlined"
                        size="small"
                        fullWidth
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DeleteIcon color="error" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{item.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SingleItem;