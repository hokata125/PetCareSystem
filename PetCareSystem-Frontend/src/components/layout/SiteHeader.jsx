import { Box, Button, Stack } from "@mui/material";
import petCareLogo from "../../assets/images/pet-care-logo.png";

const navigationItems = [
  "TRANG CHỦ",
  "DỊCH VỤ",
  "SẢN PHẨM",
  "NHẬN NUÔI",
  "GIỚI THIỆU",
];

const SiteHeader = () => {
  return (
    <Box
      component="header"
      sx={{
        height: "clamp(126px, 10.42vw, 200px)",
        bgcolor: "#ffffff",
        display: "flex",
        alignItems: "center",
        px: "clamp(40px, 3.65vw, 70px)",
      }}
    >
      <Box
        component="img"
        src={petCareLogo}
        alt="OU-Pet Center"
        sx={{
          display: "block",
          width: "clamp(205px, 16vw, 307px)",
          height: "auto",
          flexShrink: 0,
        }}
      />

      <Stack
        component="nav"
        aria-label="Điều hướng chính"
        direction="row"
        sx={{
          flex: 1,
          ml: "clamp(48px, 4vw, 77px)",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            alignItems: "center",
            mr: "clamp(24px, 2vw, 38px)",
          }}
        >
          {navigationItems.map((item) => (
            <Button
              key={item}
              type="button"
              disableRipple
              sx={{
                minWidth: 0,
                p: 0,
                color: "#155383",
                fontSize: "clamp(16px, 1.25vw, 24px)",
                fontWeight: 800,
                lineHeight: 1,
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: "transparent" },
              }}
            >
              {item}
            </Button>
          ))}
        </Box>

        <Stack direction="row" spacing="clamp(20px, 1.5vw, 29px)">
          <Button
            type="button"
            aria-current="page"
            variant="contained"
            disableElevation
            sx={authButtonStyles("#155383", "#ffffff")}
          >
            ĐĂNG NHẬP
          </Button>
          <Button
            type="button"
            variant="contained"
            disableElevation
            sx={authButtonStyles("#91d0df", "#155383")}
          >
            ĐĂNG KÝ
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

const authButtonStyles = (backgroundColor, color) => ({
  width: "clamp(136px, 10.42vw, 200px)",
  height: "clamp(50px, 3.65vw, 70px)",
  flexShrink: 0,
  borderRadius: "10px",
  bgcolor: backgroundColor,
  color,
  fontSize: "clamp(16px, 1.25vw, 24px)",
  fontWeight: 800,
  whiteSpace: "nowrap",
  "&:hover": {
    bgcolor: backgroundColor,
    filter: "brightness(0.96)",
  },
});

export default SiteHeader;
