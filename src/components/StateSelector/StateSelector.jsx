import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const states = [
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" },
];

// export default function StateSelector({
//   onChange,
//   stateSelected,
//   isSubmitted,
//   error,
//   helperText,
// }) {
//   console.log(stateSelected);
//   console.log(isSubmitted);
//   const [state, setState] = useState("");
//   const [error, setError] = useState(false);

//   // useEffect(() => {
//   //   setError(!stateSelected); // Set error to true if stateSelected is false
//   // }, [stateSelected]);

//   useEffect(() => {
//     if (isSubmitted && !stateSelected) {
//       setError(true);
//     } else {
//       setError(false);
//     }
//   }, [isSubmitted, stateSelected]);

//   const handleChange = (event) => {
//     const selectedAbbreviation = event.target.value;
//     console.log(selectedAbbreviation);
//     const newState = states.find(
//       (state) => state.abbreviation === selectedAbbreviation
//     );
//     console.log(newState);
//     setState(newState);
//     onChange(newState, newState.abbreviation);
//     setError(false);
//   };

//   return (
//     <FormControl fullWidth error={error}>
//       <InputLabel id="state-label">State</InputLabel>
//       <Select
//         labelId="state-label"
//         id="state"
//         // value={state}
//         value={state ? state.abbreviation : ""}
//         label="State"
//         onChange={handleChange}
//       >
//         {states.map((state) => (
//           <MenuItem key={state.abbreviation} value={state.abbreviation}>
//             {state.abbreviation}
//           </MenuItem>
//         ))}
//       </Select>
//       {error && <FormHelperText>Please select a state</FormHelperText>}
//     </FormControl>
//   );
// }

export default function StateSelector({
  onChange,
  stateSelected,
  isSubmitted,
  // setError,
  // error,
}) {
  const [state, setState] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isSubmitted && !stateSelected) {
      setError(true);
    } else {
      setError(false);
    }
  }, [isSubmitted, stateSelected, setError]);

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
