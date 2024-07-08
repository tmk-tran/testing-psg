import React, { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function RowRadioButtonsGroup({ onChange, resetSearchField }) {
  const [selectedValue, setSelectedValue] = useState("lastname");

  useEffect(() => {
    onChange(selectedValue); // Notify parent about the selected value
  }, [selectedValue, onChange]);

  const handleSelect = (event) => {
    setSelectedValue(event.target.value);
    resetSearchField();
  };

  return (
    <FormControl>
      <FormLabel id="search-by">Search By:</FormLabel>
      <RadioGroup
        row
        aria-labelledby="seller-search-by-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={selectedValue}
        onChange={handleSelect}
      >
        <FormControlLabel
          value="lastname"
          control={<Radio />}
          label="Last Name"
        />
        <FormControlLabel
          value="refid"
          control={<Radio />}
          label="Referral ID"
        />
      </RadioGroup>
    </FormControl>
  );
}
