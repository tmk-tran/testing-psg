import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  capitalizeFirstWord,
  capitalizeStateAbbr,
  capitalizeWords,
} from "../Utils/helpers";

export default function LocationSelect({
  label,
  fontSize = "16px",
  locations,
  selectedLocations,
  onDropdownSelectChange,
  participatingLocs,
  selectAllLocations,
  onLocationChange,
  error,
  acceptedAt,
  minWidth,
  maxWidth,
  mb = 2,
}) {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [onDropdownSelect, setOnDropdownSelect] = useState(false);

  // Update the local state when the parent's selectedLocations prop changes
  useEffect(() => {
    setSelectedLocation(selectedLocations);
  }, []);

  useEffect(() => {
    if (typeof selectedLocation === "string" && selectedLocation !== "") {
      setOnDropdownSelect(true);
      onDropdownSelectChange(true);
    } else if (Array.isArray(selectedLocation)) {
      setOnDropdownSelect(false);
    } else if (selectedLocation === null || selectedLocation === "") {
      setOnDropdownSelect(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectAllLocations) {
      setOnDropdownSelect(false);
    }
  }, [selectAllLocations]);
  // useEffect(() => {
  //   onDropdownSelectChange(onDropdownSelect);
  // }, [onDropdownSelect, onDropdownSelectChange]);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    // Get the selected location id //
    const selectedLocationId = locations.find(
      (loc) => loc.location_name === event.target.value
    )?.id;
    onLocationChange(selectedLocationId);
  };

  const handleSelectAll = () => {
    // Get an array of all location IDs
    const allLocationIds = locations
      .filter((location) => !location.is_deleted)
      .map((location) => location.id);
    setSelectedLocation(allLocationIds);
    onLocationChange(allLocationIds);
  };

  useEffect(() => {
    // Call handleSelectAll when selectAllLocations changes to true
    if (selectAllLocations) {
      handleSelectAll();
      setSelectedLocation("");
    }

    if (participatingLocs) {
      resetSelectedLocation();
    }
  }, [selectAllLocations]);

  const resetSelectedLocation = () => {
    setSelectedLocation(null);
    onLocationChange(null);
  };

  return (
    <div>
      {label && <InputLabel>{label}</InputLabel>}
      <FormControl fullWidth error={error} variant="outlined">
        <Select
          value={selectedLocation}
          onChange={handleLocationChange}
          // displayEmpty
          sx={{ mb: mb, minWidth: minWidth, maxWidth: maxWidth }}
        >
          <MenuItem value="" disabled>
            Please choose a location...
          </MenuItem>
          {locations
            .filter((location) => !location.is_deleted)
            .map((location, i) => (
              <MenuItem key={i} value={location.location_name}>
                <Typography
                  sx={{
                    fontSize: fontSize,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <strong>{capitalizeFirstWord(location.location_name)}</strong>
                  <br />
                  {capitalizeWords(location.address)}{" "}
                  {capitalizeWords(location.city)},{" "}
                  {capitalizeStateAbbr(location.state)}
                </Typography>
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>
          {error ? "Please select a location" : ""}
        </FormHelperText>
      </FormControl>
    </div>
  );
}
