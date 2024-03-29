import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { states } from "./states";

export default function StateSelector({
  onChange,
  stateSelected,
  isSubmitted,
}) {
  console.log(states);
  const [state, setState] = useState("");
  console.log(state);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isSubmitted && !stateSelected) {
      setError(true);
    } else {
      setError(false);
    }
  }, [isSubmitted, stateSelected, setError]);

  useEffect(() => {
    console.log(stateSelected);
    if (stateSelected) {
      const selectedState = states.find((state) => state.abbreviation === stateSelected);
      console.log(selectedState);
      setState(selectedState);
    } else {
      setState("");
    }
  }, []);
  
  
  const handleChange = (event) => {
    const selectedAbbreviation = event.target.value;
    const newState = states.find(
      (state) => state.abbreviation === selectedAbbreviation
    );
    setState(newState);
    onChange(newState, newState.abbreviation);
  };

  return (
    <FormControl fullWidth error={error}>
      <InputLabel id="state-label">State</InputLabel>
      <Select
        labelId="state-label"
        id="state"
        value={state ? state.abbreviation : ""}
        label="State"
        onChange={handleChange}
      >
        {states.map((state) => (
          <MenuItem key={state.abbreviation} value={state.abbreviation}>
            {state.abbreviation}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>Please select a state</FormHelperText>}
    </FormControl>
  );
}
