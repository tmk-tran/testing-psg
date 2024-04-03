import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  capitalizeStateAbbr,
  capitalizeWords,
  formatPhoneNumber,
} from "../Utils/helpers";

export default function LocationSection({ coupon }) {
  console.log(coupon);
  if (
    !coupon ||
    !coupon.locationId ||
    !coupon.locationName ||
    !coupon.phoneNumber ||
    !coupon.address ||
    !coupon.city ||
    !coupon.state ||
    !coupon.zip
  )
    return null;

  return (
    <Accordion sx={{ width: "100%" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="caption">Locations Accepted:</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {coupon.locationId[0] !== null ? (
            coupon.locationId.map((locationId, index) => (
              <Typography
                key={locationId}
                variant="body2"
                sx={{ textAlign: "center", mb: 1 }}
              >
                <strong>{capitalizeWords(coupon.locationName[index])} </strong>
                <br />
                {capitalizeWords(coupon.address[index])},{" "}
                {capitalizeWords(coupon.city[index])},{" "}
                {capitalizeStateAbbr(coupon.state[index])} {coupon.zip[index]}
                <br />
                {formatPhoneNumber(coupon.phoneNumber[index])}{" "}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              No Locations Assigned
            </Typography>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
