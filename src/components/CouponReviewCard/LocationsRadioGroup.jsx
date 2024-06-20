import React, { useEffect, useState } from "react";
import {
  Radio,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  RadioGroup,
  Typography,
} from "@mui/material";
import LocationSelect from "./LocationSelect";
import { border } from "../Utils/colors";
import { flexRowSpace } from "../Utils/pageStyles";

// SMALL ISSUE IN THIS COMPONENT:
// when a user selects 'valid at all locations', and then cancels out of modal,
// the state for the initial location gets prefilled to LocationSelect (single location already set)
//
// when selecting 'valid at all', the value in LocationSelect is stil there
//
// when a user clicks 'participating locations', and then cancels out of the modal, the value for LocationSelect
// does not get loaded. Check props passed for action related to clicking 'participating locations'
// will address this issue in the near future
//
// -T

function ValidLocationsRadio({
  fontSize = "16px",
  acceptedAt,
  onSelectAll,
  onSelectParticipatingLocs,
  isDropdownSelected,
  locations,
  selectedLocations,
  onDropdownSelectChange,
  participatingLocs,
  selectAllLocations,
  onLocationChange,
}) {
  console.log(acceptedAt);
  console.log(isDropdownSelected);
  console.log(selectAllLocations);
  console.log(isDropdownSelected);
  console.log(selectedLocations);
  console.log(participatingLocs);
  console.log(selectAllLocations);
  // need to set this when a value is selected from the dropdown in Location
  const [selectedValue, setSelectedValue] = useState("");
  console.log(selectedValue);
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  console.log(showLocationSelect);

  useEffect(() => {
    if (acceptedAt && acceptedAt.length > 1) {
      setSelectedValue("validAtAllLocations");
    }
    if (isDropdownSelected) {
      setSelectedValue(""); // Reset radio button selection if isDropdownSelected is true
    }
  }, [isDropdownSelected]);

  useEffect(() => {
    if (selectedValue === "validAtAllLocations") {
      onSelectAll(true);
      onSelectParticipatingLocs(false);
      setShowLocationSelect(false);
      onDropdownSelectChange(false); // Parent component state for isDropdownSelected
    } else if (selectedValue === "participatingLocations") {
      onSelectAll(false);
      onSelectParticipatingLocs(true);
      setShowLocationSelect(false);
      onDropdownSelectChange(false); // Parent component state for isDropdownSelected
    }
  }, [selectedValue]);

  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectedValue(event.target.value);
  };

  return (
    <FormControl component="fieldset" sx={{ width: "100%" }}>
      <FormLabel component="legend" sx={{ textAlign: "center" }}>
        Accepted at:
      </FormLabel>
      <RadioGroup
        row
        value={selectedValue}
        onChange={handleChange}
        aria-label="accepted-at-radio-group"
        name="accepted-at"
        sx={flexRowSpace}
      >
        <FormControl variant="outlined" sx={{ mr: 5 }}>
          <LocationSelect
            locations={locations}
            selectedLocations={selectedLocations}
            onDropdownSelectChange={onDropdownSelectChange}
            participatingLocs={participatingLocs}
            selectAllLocations={selectAllLocations}
            onLocationChange={onLocationChange}
            acceptedAt={acceptedAt}
            minWidth="12vw"
            maxWidth="150px"
            mb="0"
          />
        </FormControl>
        <FormControlLabel
          value="validAtAllLocations"
          control={<Radio />}
          label={
            <Typography style={{ fontSize: fontSize }}>Valid at All</Typography>
          }
        />
        <FormControlLabel
          value="participatingLocations"
          control={<Radio />}
          label={
            <Typography style={{ fontSize: fontSize }}>
              Participating Locations
            </Typography>
          }
        />
      </RadioGroup>
    </FormControl>
  );
}

export default ValidLocationsRadio;
