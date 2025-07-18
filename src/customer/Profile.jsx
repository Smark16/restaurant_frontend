import { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import useAxios from "../components/useAxios";

const changePasswordUrl = "http://127.0.0.1:8000/restaurant/change-password/";

function CustomerProfileManagement() {
  const { user } = useContext(AuthContext);
  const axiosInstance = useAxios()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const updateUser = user?.user_id
    ? `http://127.0.0.1:8000/restaurant/update_user/${user.user_id}`
    : "";
  const getUser = user?.user_id
    ? `http://127.0.0.1:8000/restaurant/get_user/${user.user_id}`
    : "";
  const updateProfileUrl = user?.user_id
    ? `http://127.0.0.1:8000/restaurant/update_profile/${user.user_id}`
    : "";
  const profileUrl = user?.user_id
    ? `http://127.0.0.1:8000/restaurant/profile/${user.user_id}`
    : "";

  const [profileImage, setProfileImage] = useState([]);
  const [profile, setProfile] = useState({ email: "", location: "", contact: "", image: null });
  const [myUser, setMyUser] = useState({
    username: "",
    is_staff: false,
    is_customer: false,
    date_joined: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password change states
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Image preview
  const [imagePreview, setImagePreview] = useState("");


  // fetch user profile
  const profileData = async () => {
    if (!user?.user_id) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(profileUrl);
      const data = response.data;
      setProfileImage(data.image)
      setProfile({
        email: data.email || "",
        location: data.location || "",
        contact: data.contact || "",
        image: data.image || null,
      });
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(err.response?.data?.message || "Failed to load profile data");
    }
  };

  // fetch users
  const fetchUser = async () => {
    if (!user?.user_id) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(getUser);
      const data = response.data;
      setMyUser({
        username: data.username || "",
        is_staff: !!data.is_staff,
        is_customer: !!data.is_customer,
        date_joined: data.date_joined || "",
        email: data.email || "",
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.response?.data?.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // handle user
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setMyUser({ ...myUser, [name]: value });
  };

  // hande image
  const changeImage = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setProfile({ ...profile, image: selectedFile });
      setImagePreview(URL.createObjectURL(selectedFile));
      setError("");
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.user_id) {
      setError("User not authenticated");
      return;
    }
    setUpdating(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    const userData = new FormData();

    userData.append("username", myUser.username || "");
    userData.append("email", myUser.email || "");
    userData.append("date_joined", myUser.date_joined || "");

    formData.append("is_staff", myUser.is_staff.toString());
    formData.append("is_customer", myUser.is_customer.toString());
    formData.append("location", profile.location || "");
    formData.append("contact", profile.contact || "");
    formData.append("email", profile.email || "");

    // Only append the image if it has been changed
    if (profile.image && typeof profile.image !== "string") {
      formData.append("image", profile.image);
    }

    try {
      const [profileRes, userRes] = await Promise.all([
        axios.put(updateProfileUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        axios.put(updateUser, userData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      ]);

      if (profileRes.status === 201 && userRes.status === 200) {
        setSuccess("Profile updated successfully!");
        showSuccessAlert("Profile Updated");
        await Promise.all([profileData(), fetchUser()]);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: message,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // handle password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!user?.user_id) {
      setPasswordMessage("User not authenticated");
      return;
    }
    setPasswordLoading(true);
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match");
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage("Password must be at least 8 characters long");
      setPasswordLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("old_password", oldPassword);
    formData.append("password", newPassword);
    formData.append("password2", confirmPassword);

    try {
      const response = await axiosInstance.put(changePasswordUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPasswordMessage("Password updated successfully!");
      showSuccessAlert("Password Changed");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setPasswordDialog(false);
        setPasswordMessage("");
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data;
      if (errorMsg?.old_password) {
        setPasswordMessage(errorMsg.old_password[0] || "Invalid old password");
      } else {
        setPasswordMessage(errorMsg?.message || "An error occurred. Please try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.user_id) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    const loadData = async () => {
      await Promise.all([profileData(), fetchUser()]);
    };
    loadData();
  }, [user]);

  if (!user?.user_id) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">Please log in to view your profile.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PersonIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                Profile Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage your account information and settings
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Overview */}
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3, height: "fit-content" }}>
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                {/* Profile Image */}
                <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
                  {imagePreview ? (
                     <Avatar
                    src={imagePreview || "/placeholder.svg"}
                    alt="Profile"
                    sx={{
                      width: 120,
                      height: 120,
                      border: "4px solid",
                      borderColor: "primary.main",
                    }}
                  />
                  ) : profileImage ? (
                     <Avatar
                    src={profileImage}
                    alt="Profile"
                    sx={{
                      width: 120,
                      height: 120,
                      border: "4px solid",
                      borderColor: "primary.main",
                    }}
                  />
                  ) : (<p>No image</p>)}
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-image-upload"
                    style={{ display: "none" }}
                    onChange={changeImage}
                  />
                  <label htmlFor="profile-image-upload">
                    <IconButton
                      component="span"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </label>
                </Box>

                {/* User Info */}
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {myUser.username || "Unknown"}
                </Typography>

                <Stack spacing={2} alignItems="center">
                  <Chip
                    icon={myUser.is_staff ? <AdminIcon /> : < PersonIcon />}
                    label={myUser.is_staff ? "Staff Member" : "Customer"}
                    color={myUser.is_staff ? "secondary" : "primary"}
                    variant="outlined"
                  />

                  <Box sx={{ textAlign: "left", width: "100%" }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">{myUser.email || "Not provided"}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">{profile.contact || "Not provided"}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2">{profile.location || "Not provided"}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {myUser.date_joined
                            ? `Joined ${new Date(myUser.date_joined).toLocaleDateString()}`
                            : "Not provided"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Edit Profile Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EditIcon />
                  Edit Profile Information
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Username */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={myUser.username || ""}
                        onChange={handleUserChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={myUser.email || ""}
                        onChange={handleUserChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Contact */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contact"
                        name="contact"
                        value={profile.contact || ""}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Location */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={profile.location || ""}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                      <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ mt: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={updating ? <CircularProgress size={20} /> : <SaveIcon />}
                          disabled={updating || !user?.user_id}
                          sx={{ flex: 1 }}
                        >
                          {updating ? "Updating..." : "Update Profile"}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<LockIcon />}
                          onClick={() => setPasswordDialog(true)}
                          disabled={!user?.user_id}
                          sx={{ flex: 1 }}
                        >
                          Change Password
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Password Change Dialog */}
        <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LockIcon />
            Change Password
          </DialogTitle>
          <form onSubmit={handlePasswordChange}>
            <DialogContent>
              <Stack spacing={3}>
                {passwordMessage && (
                  <Alert severity={passwordMessage.includes("successfully") ? "success" : "error"}>
                    {passwordMessage}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Current Password"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                          {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  helperText="Password must be at least 8 characters long"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPasswordDialog(false)} disabled={passwordLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={passwordLoading || !user?.user_id}
                startIcon={passwordLoading ? <CircularProgress size={20} /> : <LockIcon />}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
}

export default CustomerProfileManagement;