import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import authBackground from "../../../assets/images/auth-background.png";
import { login } from "../api/authApi";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await login({ username, password });
      setSuccessMessage("Đăng nhập thành công!");
    } catch (error) {
      const detail = error.response?.data?.detail;
      const validationMessage = Array.isArray(detail)
        ? detail
            .map((validationError) =>
              validationError.msg?.replace(/^Value error,\s*/, ""),
            )
            .filter(Boolean)
            .join(" ")
        : "";

      setErrorMessage(
        typeof detail === "string"
          ? detail
          : validationMessage || "Không thể đăng nhập. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="section"
      aria-labelledby="login-title"
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "2048 / 2112",
        backgroundImage: `url(${authBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          position: "absolute",
          top: "20.9%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "57.2%",
          height: "58%",
          border: "4px solid #111111",
          borderRadius: "clamp(20px, 1.56vw, 30px)",
          overflow: "hidden",
          bgcolor: "#ffffff",
        }}
      >
        <Box
          sx={{
            height: "17.45%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#ffffff",
          }}
        >
          <Typography
            id="login-title"
            component="h1"
            sx={{
              m: 0,
              color: "#155383",
              fontSize: "clamp(36px, 3.02vw, 58px)",
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            ĐĂNG NHẬP TÀI KHOẢN
          </Typography>
        </Box>

        <Box
          sx={{
            height: "82.55%",
            bgcolor: "#91d0df",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Stack
            spacing="clamp(24px, 2.34vw, 45px)"
            sx={{ width: "73%", pt: "8.2%" }}
          >
            <LoginInput
              id="username"
              label="Tên đăng nhập"
              placeholder="Nhập vào tài khoản của bạn..."
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              disabled={isSubmitting}
            />

            <LoginInput
              id="password"
              label="Mật khẩu"
              placeholder="Nhập vào mật khẩu của bạn..."
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
            />

            <Typography
              sx={{
                color: "#ffffff",
                fontSize: "clamp(18px, 1.45vw, 28px)",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Bạn chưa có tài khoản? Hãy{" "}
              <Box component="span" sx={{ color: "#155383", fontWeight: 800 }}>
                đăng ký ngay!
              </Box>
            </Typography>

            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={isSubmitting}
              sx={{
                height: "clamp(48px, 3.65vw, 70px)",
                borderRadius: "clamp(8px, 0.73vw, 14px)",
                bgcolor: "#155383",
                color: "#ffffff",
                fontSize: "clamp(20px, 1.56vw, 30px)",
                fontWeight: 800,
                lineHeight: 1,
                "&:hover": { bgcolor: "#10466f" },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size="1.1em" color="inherit" />
              ) : (
                "ĐĂNG NHẬP"
              )}
            </Button>

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && (
              <Alert severity="success">{successMessage}</Alert>
            )}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

const LoginInput = ({
  id,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  autoComplete,
  disabled,
}) => {
  return (
    <Box
      sx={{
        minHeight: "clamp(96px, 7.81vw, 150px)",
        bgcolor: "#ffffff",
        borderRadius: "clamp(8px, 0.52vw, 10px)",
        px: "clamp(14px, 1.04vw, 20px)",
        py: "clamp(12px, 0.83vw, 16px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        component="label"
        htmlFor={id}
        sx={{
          color: "#155383",
          fontSize: "clamp(18px, 1.45vw, 28px)",
          fontWeight: 800,
          lineHeight: 1.15,
        }}
      >
        {label}
      </Typography>
      <InputBase
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        required
        fullWidth
        sx={{
          mt: "clamp(5px, 0.47vw, 9px)",
          color: "#4a4a4a",
          fontSize: "clamp(18px, 1.45vw, 28px)",
          lineHeight: 1.2,
          "& input::placeholder": {
            color: "#555555",
            opacity: 1,
          },
        }}
      />
    </Box>
  );
};

export default LoginPage;
