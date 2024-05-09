import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import "./LinksSocial.css";

export default function LinksSocial({ colors = [] }) {
  return (
    <div className="links-social">
      <a
        href="https://www.facebook.com/thepreferredsavingsguide/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookIcon id="fb-icon" style={{ color: colors[0] || "#1877f2" }} />
      </a>
      {/* <a
        href="https://www.instagram.com/thepreferredsavingsguide/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <InstagramIcon id="ig-icon" style={{ color: colors[1] || "#E4405F" }} />
      </a>
      <a
        href="https://www.linkedin.com/company/the-preferred-savings-guide/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedInIcon id="li-icon" style={{ color: colors[2] || "#0077B5" }} />
      </a>
      <a
        href="https://www.twitter.com/bluecouponbook"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TwitterIcon id="x-icon" style={{ color: colors[3] || "#1DA1F2" }} />
      </a> */}
    </div>
  );
}
