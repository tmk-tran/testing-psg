import React from "react";
// ~~~~~~~~~~ Components ~~~~~~~~~ //
import Typography from "../Typography/Typography";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import {
  capitalizeStateAbbr,
  capitalizeWords,
  formatPhoneNumber,
} from "../Utils/helpers";

const textStyle = {
  display: "inline",
};

const bold = {
  fontWeight: "bold",
};

const CouponLocations = ({ locations }) => {
  if (
    !locations ||
    locations.length === 0 ||
    locations.some(
      (location) =>
        location.location_name === null ||
        location.phone_number === null ||
        location.address === null ||
        location.city === null ||
        location.state === null ||
        location.zip === null
    )
  ) {
    return (
      <>
        <Typography label="Locations Accepted:" variant="h6" />
        <br />
        <Typography
          label="Valid at participating locations"
          sx={{ mb: 2, ml: 4 }}
        />
      </>
    );
  }

  return (
    <div>
      <Typography label="Accepted Locations:" variant="h6" />
      <ol>
        {locations.map((location, index) => (
          <li key={index}>
            <Typography
              label="Location Name: "
              variant="body2"
              sx={{ ...textStyle, ...bold }}
            />
            <Typography
              label={
                location.location_name
                  ? capitalizeWords(location.location_name)
                  : ""
              }
              variant="body2"
              sx={textStyle}
            />
            <br />
            <Typography
              label="Phone: "
              variant="body2"
              sx={{ ...textStyle, ...bold }}
            />
            <Typography
              label={
                location.phone_number
                  ? formatPhoneNumber(location.phone_number)
                  : ""
              }
              variant="body2"
              sx={textStyle}
            />
            <br />
            <Typography
              label="Address: "
              variant="body2"
              sx={{ ...textStyle, ...bold }}
            />
            <Typography
              label={`${
                location.address ? capitalizeWords(location.address) + " " : ""
              }${location.city ? capitalizeWords(location.city) + ", " : ""}${
                location.state ? capitalizeStateAbbr(location.state) + " " : ""
              }${location.zip || ""}`}
              variant="body2"
              sx={textStyle}
            />
            <br />
            <br />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CouponLocations;
