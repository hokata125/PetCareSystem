import { Box, Typography } from "@mui/material";
import petCareLogo from "../../assets/images/pet-care-logo.png";

const SiteFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        minHeight: "clamp(250px, 19.27vw, 370px)",
        bgcolor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 5,
      }}
    >
      <Box
        sx={{
          width: "min(76vw, 1450px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(55px, 4vw, 77px)",
        }}
      >
        <Box
          sx={{
            width: "clamp(430px, 33.85vw, 650px)",
            border: "4px solid #111111",
            borderRadius: "14px",
            px: "clamp(18px, 1.45vw, 28px)",
            py: "clamp(16px, 1.25vw, 24px)",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={petCareLogo}
            alt="OU-Pet Center"
            sx={{ display: "block", width: "100%", height: "auto" }}
          />
        </Box>

        <Typography
          component="address"
          sx={{
            color: "#155383",
            fontSize: "clamp(18px, 1.45vw, 28px)",
            fontWeight: 600,
            fontStyle: "normal",
            lineHeight: 1.22,
            whiteSpace: "nowrap",
          }}
        >
          <Box component="span" sx={{ fontWeight: 800 }}>
            Địa chỉ:
          </Box>
          <br />
          CS1: ABC
          <br />
          CS2: DEF
          <br />
          <Box component="span" sx={{ fontWeight: 800 }}>
            Hotline liên hệ:
          </Box>
          <br />
          0123456789&nbsp;&nbsp; - &nbsp;&nbsp;0987654321&nbsp;&nbsp; -
          &nbsp;&nbsp;0135791113
        </Typography>
      </Box>
    </Box>
  );
};

export default SiteFooter;
