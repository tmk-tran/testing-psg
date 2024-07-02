import { Box } from "@mui/material";
import { HelpPageTypography } from "./Introduction";
import { imageSize, imageStyle, imgBoxStyle } from "./contentStyles";

export default function LoginHelpContent() {
  return (
    <>
      <HelpPageTypography variant="h4">Login</HelpPageTypography>
      <HelpPageTypography variant="h6">How to login:</HelpPageTypography>
      <HelpPageTypography variant="body2">
        Upon navigation to the application URL, the user will be prompted to
        login with a username and password:
      </HelpPageTypography>
      <Box sx={imgBoxStyle}>
        <img
          src="/images/login-screen.png"
          alt="desktop image of login page"
          style={imageStyle}
        />
      </Box>
      <HelpPageTypography variant="body2">
        Use this form to login to the application:
      </HelpPageTypography>
      <Box sx={imgBoxStyle}>
        <img
          src="/images/login-screen-close.png"
          alt="close-up of login screen"
          style={imageSize}
        />
      </Box>
      <HelpPageTypography variant="body2">
        Clicking the Forgot Password button will issue user a new password, and
        send a confirmation email
      </HelpPageTypography>
      <br />
      <HelpPageTypography variant="body2">
        Upon a successful sign-in, the user will now be able to access the
        application dashboard. The view will be different depending on the
        user's role. Please visit the 'Roles' section for more information.
      </HelpPageTypography>
    </>
  );
}
