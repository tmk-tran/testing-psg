import React, { useState, useEffect } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
} from "@mui/material";
import { dispatchHook } from "../../hooks/useDispatch";
import { allYears } from "../../hooks/reduxStore";
import { useSelector } from "react-redux";

export default function YearSelect({
  year,
  setYear,
  labelOutside,
  sx,
  setActiveYearError,
  error,
  helperText,
}) {
  const dispatch = dispatchHook();
  const auth = useSelector((store) => store.auth)
  const [yearSelected, setYearSelected] = useState("");
  console.log(year);
  console.log(helperText);
  useEffect(() => {
    // Set the initial selected year to the ID of the active year

    // if (year.length > 0) {
    //   const activeYearId = year.find((y) => y.active)?.id || "";
    //   setYearSelected(activeYearId);
    // }
    if (Array.isArray(year) && year.length > 0) {
      const activeYearId = year.find((y) => y.active)?.id || "";
      setYearSelected(activeYearId);
    }

    const dispatchAction = {
      type: "FETCH_COUPON_BOOKS", payload: auth
    };
    dispatch(dispatchAction);
  }, []);

  const years = allYears();
  console.log(years);

  const handleChange = (event) => {
    labelOutside && setActiveYearError(false);
    setYearSelected(event.target.value);
    setYear(event.target.value);
  };

  return (
    <Box sx={sx}>
      {labelOutside ? (
        <>
          <InputLabel>Book Year</InputLabel>
          <FormControl fullWidth>
            <Select
              value={yearSelected}
              label="Book Year"
              onChange={handleChange}
              error={error}
              helperText={error ? helperText : ""}
            >
              {years.map((year) => (
                <MenuItem key={year.id} value={year.id}>
                  {year.year}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" sx={{ color: "red" }}>
                {helperText}
              </Typography>
            )}
          </FormControl>
        </>
      ) : (
        <FormControl fullWidth>
          <InputLabel>Book Year</InputLabel>
          <Select
            value={yearSelected}
            label="Book Year"
            onChange={handleChange}
          >
            {years.map((year) => (
              <MenuItem key={year.id} value={year.id}>
                {year.year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
