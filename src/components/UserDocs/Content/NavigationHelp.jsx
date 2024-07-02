import { flexColumn, flexRowSpace } from "../../Utils/pageStyles";
import { HelpPageTypography } from "./Introduction";
import {
  imageSize,
  imageStyle,
  imgBoxStyle,
  largeImageSize,
} from "./contentStyles";
import { Box } from "@mui/material";

const iframeContainerStyle = {
  position: "relative",
  width: "100%",
  height: "640px",
  borderRadius: "5px", // Rounded corners for the container
  overflow: "hidden", // Ensures the iframe fits within the container's rounded corners
};

const iframeStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  border: "none", // Removes the default border
};

export default function NavigationHelpContent() {
  return (
    <>
      <HelpPageTypography variant="h4">Navigation</HelpPageTypography>
      <HelpPageTypography variant="h6">Navigating the App</HelpPageTypography>
      <HelpPageTypography variant="body1">
        As an admin user, you will have access to the following links:
      </HelpPageTypography>
      <Box
        component="img"
        src="/images/admin-navlinks.png"
        alt="image of links available to admin role"
        sx={imageStyle}
      />
      <HelpPageTypography variant="body1">
        'Home' will display the main account list of organizations/merchants
        stored in the app:
      </HelpPageTypography>
      <Box
        component="img"
        src="/images/admin-home-orgs.png"
        alt="image of organizations when viewed as an admin"
        sx={imageStyle}
      />
      <HelpPageTypography variant="body2">
        Clicking the toggle button in the left corner will switch between
        Organizations and Merchants:
      </HelpPageTypography>
      <Box sx={{ ...flexRowSpace, gap: 5, mb: 5 }}>
        <Box
          component="img"
          src="/images/toggle-merchants.png"
          alt="image of list of merchants when toggled"
          sx={largeImageSize}
        />
        <Box
          component="img"
          src="/images/toggle-orgs.png"
          alt="image of list of organizations when toggled"
          sx={largeImageSize}
        />
      </Box>
      <HelpPageTypography variant="body2">
        The 'Sellers' button will open an area at the top of the page to search
        for sellers and display their referral link and organization:
      </HelpPageTypography>
      <Box
        component="img"
        src="/images/seller-search-button.png"
        alt="image of seller search button outlined in red"
        sx={{ ...imageStyle, mb: 5 }}
      />
      <HelpPageTypography variant="body2">
        Here, you can search for a seller using their last name, or by using
        their referral ID. Check out the guide below to learn more:
      </HelpPageTypography>
      <Box sx={iframeContainerStyle}>
        <iframe
          src="https://scribehow.com/embed/Searching_for_a_Seller__SBqbLSFjQdiDO2fupfJGuw"
          width="100%"
          height="640"
          allowfullscreen
          frameborder="0"
        ></iframe>
      </Box>
      <br />
      <HelpPageTypography variant="body2">
        Using a seller's referral ID will return a similar result with an
        identical action:
      </HelpPageTypography>
      <Box
        component="img"
        src="/images/seller-refid-result.png"
        alt="image of the seller search result when using referral ID"
        sx={imageStyle}
      />
    </>
  );
}
