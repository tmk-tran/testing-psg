import { Typography } from "@mui/material";
import {
  typographyListColor,
  StyledList,
  StyledListItem,
} from "./contentStyles";

// Sets margin bottom to 2
export const HelpPageTypography = (props) => {
  return <Typography {...props} sx={{ mb: 2, color: "ghostwhite" }} />;
};

const features = [
  {
    title: "Coupon Development",
    description:
      "Create, manage, and publish coupons from initial design to consumer availability.",
  },
  {
    title: "Task Tracking System",
    description: "Manage tasks, communicate with admin, and track progress.",
  },
  {
    title: "Seller Organization",
    description: "Organize sellers, track metrics, and manage sales data.",
  },
  {
    title: "Unique Seller URLs",
    description:
      "Generate unique web links for sellers to sell their coupon books.",
  },
  {
    title: "PayPal Integration",
    description:
      "Integrate PayPal for secure transactions within the application.",
  },
];

export default function GettingStarted() {
  return (
    <>
      <HelpPageTypography variant="h4">
        Welcome to The Preferred Savings Guide!
      </HelpPageTypography>
      <HelpPageTypography variant="body1">
        This application is designed to provide a comprehensive solution for
        coupon development, management, and sales.
      </HelpPageTypography>
      <HelpPageTypography variant="body1">Key Objectives:</HelpPageTypography>
      <StyledList>
        {features.map((feature, index) => (
          <StyledListItem key={index}>
            <Typography variant="body2" sx={typographyListColor}>
              <strong>{feature.title}:</strong> {feature.description}
            </Typography>
          </StyledListItem>
        ))}
      </StyledList>
      <HelpPageTypography variant="body1">
        These modules aim to streamline coupon management, improve seller
        organization, and enhance the user experience for administrators and
        sellers alike.
      </HelpPageTypography>
    </>
  );
}
