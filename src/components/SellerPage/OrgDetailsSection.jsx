import { Box, Card, CardContent, Typography } from "@mui/material";
import { primaryColor } from "../Utils/colors";

export default function OrgDetailsSection({ isMobile, seller }) {
  return (
    <Card elevation={3} sx={{ width: isMobile ? "100%" : "40%" }}>
      <CardContent>
        {/* ~~~~~ HEADER ~~~~~ */}
        <Box sx={{ width: isMobile ? "100%" : "25%", margin: "0 auto" }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              borderBottom: `1px solid ${primaryColor.color}`,
              textAlign: "center",
            }}
          >
            Organization:
          </Typography>
        </Box>
        {/* ~~~~~ NAME ~~~~~ */}
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {seller.organization_name}
        </Typography>
        {/* ~~~~~ ADDRESS ~~~~~ */}
        <Typography sx={{ textAlign: "center" }}>{seller.address}</Typography>
        <Typography sx={{ textAlign: "center" }}>
          {seller.city}, {seller.state} {seller.zip}
        </Typography>
      </CardContent>
    </Card>
  );
}
