import { HelpPageTypography } from "./Introduction";
import { Box, Typography } from "@mui/material";
import {
  typographyListColor,
  StyledList,
  StyledListItem,
  imgBoxStyle,
} from "./contentStyles";

const roles = ["Admin", "Graphic Designer", "Organization Admin", "Seller"];
const roleDetails = [
  {
    role: "Admin",
    description:
      "The highest level of access with full control over the application.  The links available are:",
    imageUrl: "/images/admin-navlinks.png",
  },
  {
    role: "Graphic Designer",
    description:
      "Responsible for designing coupon graphics and managing tasks within the application. Links available are:",
    imageUrl: "/images/graphic-design-navlinks.png",
  },
  {
    role: "Organization Admin",
    description:
      "Manages organization profile and sellers within. Will have access ONLY to the organization(s) they are assigned. The landing page will look similar to this:",
    imageUrl: "/images/orgadmin-dashboard.png",
  },
  {
    role: "Seller",
    description:
      "Manage the sale of coupon books. Each seller is assigned a unique referral ID, and issued a link to the application. A seller's link will navigate to a page like this:",
    imageUrl: "/images/seller-landing.png",
  },
];

export default function RolesHelpContent() {
  return (
    <>
      <HelpPageTypography variant="h4">Roles</HelpPageTypography>
      <HelpPageTypography variant="body1">
        This application supports the following user roles:
      </HelpPageTypography>
      <StyledList>
        {roles.map((role, index) => (
          <StyledListItem key={index}>
            <Typography variant="body2" sx={typographyListColor}>
              {role}
            </Typography>
          </StyledListItem>
        ))}
      </StyledList>
      <HelpPageTypography variant="h6">
        Each role has specific permissions and responsibilities:
      </HelpPageTypography>
      {roleDetails.map((detail, index) => (
        <Box key={index} sx={{ mb: 8 }}>
          <HelpPageTypography variant="body2">
            <strong>{detail.role}:</strong> {detail.description}
          </HelpPageTypography>
          {/* <img src={detail.imageUrl} alt={detail.role} style={{ width: '100%', marginTop: '8px', borderRadius: '4px' }} /> */}
          <img src={detail.imageUrl} alt={detail.role} style={imgBoxStyle} />
        </Box>
      ))}
    </>
  );
}
