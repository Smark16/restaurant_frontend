"use client"

import { useState, useContext } from "react"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Container,
  Paper,
  Divider,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material"
import { Visibility, VisibilityOff, Person, Lock, Login as LoginIcon } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { AuthContext } from "../Context/AuthContext"
import Bar from "./Navbar"

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState({ username: "", password: "" })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { loginUser, Loginloading, noActive } = useContext(AuthContext)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!user.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!user.password) {
      newErrors.password = "Password is required"
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      if (loginUser) {
        await loginUser(user.username, user.password)
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Bar />
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            py: 4,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Card sx={{ border: "none", boxShadow: "none" }}>
              <CardContent sx={{ p: 4 }}>
                {/* Header */}
                <Box textAlign="center" mb={4}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                    }}
                  >
                    <LoginIcon sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary" gutterBottom>
                    Welcome Back! 👋
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to your account to continue
                  </Typography>
                </Box>

                {/* Error Alert */}
                {noActive && (
                  <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                    {noActive}
                  </Alert>
                )}

                {/* Login Form */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    value={user.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color={errors.username ? "error" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color={errors.password ? "error" : "action"} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting || Loginloading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        boxShadow: "0 6px 25px rgba(102, 126, 234, 0.5)",
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": {
                        background: "rgba(0, 0, 0, 0.12)",
                        boxShadow: "none",
                      },
                      transition: "all 0.3s ease",
                    }}
                    startIcon={
                      isSubmitting || Loginloading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />
                    }
                  >
                    {isSubmitting || Loginloading ? "Signing In..." : "Sign In"}
                  </Button>

                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      or
                    </Typography>
                  </Divider>

                  {/* Footer Links */}
                  <Box textAlign="center" mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{" "}
                      <MuiLink
                        component={Link}
                        to="/signup"
                        sx={{
                          color: "primary.main",
                          textDecoration: "none",
                          fontWeight: "bold",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Create one
                      </MuiLink>
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Forgot your password?{" "}
                      <MuiLink
                        component={Link}
                        to="/forgot-password"
                        sx={{
                          color: "primary.main",
                          textDecoration: "none",
                          fontWeight: "bold",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Reset it here
                      </MuiLink>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Box>
      </Container>
    </>
  )
}

export default Login