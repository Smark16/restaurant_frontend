import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Container,
  Grid,
  Paper,
  Avatar,
  Divider,
  Link,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Person, Email, Lock, PersonAdd, AdminPanelSettings, Restaurant } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../Context/AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontSize: "1rem",
          padding: "12px 24px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const registerurl = "https://restaurant-backend5.onrender.com/restaurant/register";

function SignupPage() {
  const navigate = useNavigate();
  const { showSuccessAlert, showErrorAlert} = useContext(AuthContext)

  const [person, setPerson] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState('');
  const [userNameErrror, setUserNameError] = useState('')
  const [passwordError, setPasswordError] = useState([])

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });

  };

  const handleRoleChange = (e) => {
    setPerson({ ...person, role: e.target.value });
  };

  const RegisterUser = async (email, username, password, role) => {
    try {
      const is_staff = role === "staff";
      const is_customer = role === "customer";

      const response = await fetch(registerurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          is_staff,
          is_customer,
        }),
      });

      if (response.status === 201) {
        showSuccessAlert("Success! Registration successful, you can login now")
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        setUserNameError(err.response.data.contact)
        setPasswordError(err.response.data.password)
      } else {
        setError("Failed to register. Please try again later.");
      }

    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, username, password, role } = person;
    await RegisterUser(email, username, password, role);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            {/* Image Section */}
            <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
              <Paper
                elevation={12}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  height: 600,
                  background: `url('/cutlery.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(45deg, rgba(25,118,210,0.8), rgba(156,39,176,0.6))",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 40,
                    left: 40,
                    zIndex: 1,
                    color: "white",
                  }}
                >
                  <Typography variant="h4" gutterBottom fontWeight="bold">
                    Welcome to Our Restaurant
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Join our community and enjoy amazing dining experiences
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Form Section */}
            <Grid item xs={12} md={6}>
              <Card
                elevation={16}
                sx={{
                  maxWidth: 480,
                  mx: "auto",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Header */}
                  <Box textAlign="center" mb={4}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mx: "auto",
                        mb: 2,
                        background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                      }}
                    >
                      <Restaurant fontSize="large" />
                    </Avatar>
                    <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
                      Create Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Join our restaurant community today
                    </Typography>
                  </Box>

                  <form onSubmit={handleSubmit}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {/* Username Field */}
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        type="text"
                        required
                        value={person.username}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        helperText={userNameErrror}
                      />

                      {/* Email Field */}
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        required
                        value={person.email}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      {/* Password Field */}
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        required
                        value={person.password}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                       {passwordError && passwordError.map(err => <p className="text-danger">{err}</p>)}

                      {/* Role Selection */}
                      <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
                          Account Type
                        </FormLabel>
                        <RadioGroup row value={person.role} onChange={handleRoleChange} sx={{ gap: 2 }}>
                          <Paper
                            elevation={person.role === "customer" ? 4 : 1}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: person.role === "customer" ? 2 : 1,
                              borderColor: person.role === "customer" ? "primary.main" : "grey.300",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                              "&:hover": { elevation: 3 },
                            }}
                          >
                            <FormControlLabel
                              value="customer"
                              control={<Radio />}
                              label={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <PersonAdd color="primary" />
                                  <Typography variant="body2" fontWeight={500}>
                                    Customer
                                  </Typography>
                                </Box>
                              }
                            />
                          </Paper>

                          <Paper
                            elevation={person.role === "staff" ? 4 : 1}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: person.role === "staff" ? 2 : 1,
                              borderColor: person.role === "staff" ? "primary.main" : "grey.300",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                              "&:hover": { elevation: 3 },
                            }}
                          >
                            <FormControlLabel
                              value="staff"
                              control={<Radio />}
                              label={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <AdminPanelSettings color="primary" />
                                  <Typography variant="body2" fontWeight={500}>
                                    Staff
                                  </Typography>
                                </Box>
                              }
                            />
                          </Paper>
                        </RadioGroup>
                      </FormControl>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading || !person.role}
                        sx={{
                          mt: 2,
                          py: 1.5,
                          background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                          "&:hover": {
                            background: "linear-gradient(45deg, #1565c0, #7b1fa2)",
                          },
                        }}
                      >
                        {loading ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <CircularProgress size={20} color="inherit" />
                            Creating Account...
                          </Box>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </Box>
                  </form>

                  {/* Login Link */}
                  <Box mt={3}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" textAlign="center" color="text.secondary">
                      Already have an account?{" "}
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate("/login")}
                        sx={{
                          fontWeight: 600,
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Sign in here
                      </Link>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default SignupPage;