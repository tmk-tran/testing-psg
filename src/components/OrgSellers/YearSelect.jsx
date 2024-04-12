import React, { useState, useEffect } from "react";
import {
  CircularProgress,
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
import { flexCenter } from "../Utils/pageStyles";

const loadingSx = {

};
export default function YearSelect({
  yearsLoading,
  loadComplete,
  year,
  setYear,
  labelOutside,
  sx,
  setActiveYearError,
  error,
  helperText,
}) {
  const dispatch = dispatchHook();
  const auth = useSelector((store) => store.auth);
  const [yearSelected, setYearSelected] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const years = allYears();
  console.log(years);

  useEffect(() => {
    // Set the initial selected year to the ID of the active year

    if (Array.isArray(year) && year.length > 0) {
      const activeYearId = year.find((y) => y.active)?.id || "";
      setYearSelected(activeYearId);
    }

    const dispatchAction = {
      type: "FETCH_COUPON_BOOKS",
      payload: auth,
    };
    dispatch(dispatchAction);
  }, []);

  useEffect(() => {
    if (years.length > 0) {
      setIsLoading(false);
      // loadComplete();
    }
  }, [years]);

  const handleChange = (event) => {
    labelOutside && setActiveYearError(false);
    setYearSelected(event.target.value);
    setYear(event.target.value);
  };

  return (
    <>
      {isLoading ? (
        <Box sx={{ ...sx, ...flexCenter}}>
        <CircularProgress size={25} sx={{ mr: 1 }} />
        Loading...
        </Box>
      ) : (
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
                  {!isLoading &&
                    years.map((year) => (
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
      )}
    </>
  );
}
