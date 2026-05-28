import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, IconButton, InputAdornment, Alert, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { BASE_URL } from "../utils/BASE_URL";
//import { TextFieldProps } from "@mui/material";

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("Login Response:", data);

      //  validation errors from backend
      if (Array.isArray(data)) {
        setError(data[0]);
        setIsLoading(false);
        return;
      }

      //  invalid credentials
      if (!data.access) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      //  store tokens
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      //  store user data
      if (data.user) {
        const userData =
        {
          full_name: data.user.full_name,
          email: data.user.email,
          role: data.user.role,
        };

        localStorage.setItem("user", JSON.stringify(userData));
      }

      if (data.user?.role !== "exec_approver") {
        setError("Only executives can Login to this form");
        localStorage.clear(); // important for security
        setIsLoading(false);
        return;
      }

      navigate("/executive-form");

    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 420,
        mx: "auto",
        mt: 10,
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          border: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Log In to AMS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Where Marketing Gets Smarter...
          </Typography>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleLogin}>

          {/* Email */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            EMAIL ADDRESS
          </Typography>
          <TextField
            fullWidth
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            disabled={isLoading}
            sx={{ mb: 2 }}
          />

          {/* Password */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            PASSWORD
          </Typography>

          {/* <TextField
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            disabled={isLoading}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            } as any}
          /> */}

          <TextField
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            disabled={isLoading}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember Me"
            sx={{ mb: 2 }}
          />

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              height: 48,
              backgroundColor: "#1a2c47",
              "&:hover": { backgroundColor: "#16263d" },
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                LOGGING IN...
              </Box>
            ) : (
              "PROCEED"
            )}
          </Button>

        </Box>
      </Box>
    </Box>
  );
}

export default LoginForm;