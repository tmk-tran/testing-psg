import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {
  capitalizeFirstWord,
  capitalizeStateAbbr,
  capitalizeWords,
} from "../Utils/helpers";

export default function LocationSelect({
  label,
  locations,
  onLocationChange,
  selectAllLocations,
  error,
}) {
  console.log(locations);
  const [selectedLocation, setSelectedLocation] = useState("");
  console.log(selectedLocation);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    // Get the selected location id //
    const selectedLocationId = locations.find(
      (loc) => loc.location_name === event.target.value
    )?.id;
    console.log(selectedLocationId);
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
    }
  }, [selectAllLocations]);

  return (
    <div>
      {label && <InputLabel>{label}</InputLabel>}
      <FormControl fullWidth error={error} variant="outlined">
        <Select
          value={selectedLocation}
          onChange={handleLocationChange}
          // displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem value="" disabled>
            Please choose a location...
          </MenuItem>
          {locations
            .filter((location) => !location.is_deleted)
            .map((location, i) => (
              <MenuItem key={i} value={location.location_name}>
                {capitalizeFirstWord(location.location_name)}
                <br />
                {capitalizeWords(location.address)}{" "}
                {capitalizeWords(location.city)},{" "}
                {capitalizeStateAbbr(location.state)}
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
