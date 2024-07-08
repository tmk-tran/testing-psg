import React from "react";
import { List, ListItem, ListItemIcon, Typography } from "@mui/material";
// ~~~~~~~~~~ Icons ~~~~~~~~~~
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PublicIcon from "@mui/icons-material/Public";
// ~~~~~~~~~~ Utils ~~~~~~~~~~
import { capitalizeWords, centerStyle } from "../Utils/helpers";
import { centeredStyle } from "../Utils/pageStyles";
import { primaryColor } from "../Utils/colors";

const typographySx = {
  mr: 2,
};

export default function ContactDetailsList({
  info,
  contactPhone,
  isMerchantTaskPage,
}) {
  console.log(info.website);
  return (
    <List style={{ padding: "15px", marginTop: "5px" }}>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ CONTACT NAME ~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <ListItem disablePadding>
        <ListItemIcon style={centeredStyle}>
          <AccountBoxIcon style={primaryColor} />
        </ListItemIcon>
        <Typography>{`${capitalizeWords(
          info.primary_contact_first_name
        )} ${capitalizeWords(info.primary_contact_last_name)}`}</Typography>
      </ListItem>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ PHONE NUMBER ~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <ListItem disablePadding style={centerStyle}>
        <ListItemIcon style={centeredStyle}>
          <PhoneIcon style={primaryColor} />
        </ListItemIcon>
        <Typography>{contactPhone}</Typography>
      </ListItem>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~~~ EMAIL ~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <ListItem disablePadding style={centerStyle}>
        <ListItemIcon style={centeredStyle}>
          <EmailIcon style={primaryColor} />
        </ListItemIcon>
        <Typography sx={typographySx}>
          {isMerchantTaskPage ? (
            info.contact_email ? (
              <a href={`mailto:${info.contact_email}`}>{info.contact_email}</a>
            ) : (
              "No Email Provided"
            )
          ) : info.primary_contact_email ? (
            <a href={`mailto:${info.primary_contact_email}`}>
              {info.primary_contact_email}
            </a>
          ) : (
            "No Email Provided"
          )}
        </Typography>
      </ListItem>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~~~ WEBSITE ~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {isMerchantTaskPage ? (
        <ListItem disablePadding style={centerStyle}>
          <ListItemIcon style={centeredStyle}>
            <PublicIcon style={primaryColor} />
          </ListItemIcon>
          <Typography sx={typographySx}>
            {info.website ? (
              <a
                href={`https://${info.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {info.website}
              </a>
            ) : (
              <Typography>No Website Provided</Typography>
            )}
          </Typography>
        </ListItem>
      ) : null}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
    </List>
  );
}
