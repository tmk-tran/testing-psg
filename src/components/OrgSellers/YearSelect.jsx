import { useState, useEffect } from "react";
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

export default function YearSelect({
  year,
  setYear,
  labelOutside,
  sx,
  setActiveYearError,
  error,
  helpertext,
  assignedYearId,
}) {
  const dispatch = dispatchHook();
  const [yearSelected, setYearSelected] = useState(assignedYearId ?? null);

  useEffect(() => {
    if (!year || year.length === 0) return; // guard in case it's not loaded yet

    // Find the active year object
    const activeYear = year.find((y) => y.active);

    if (activeYear) {
      setYearSelected(activeYear.id); // MUI Select value
    }

    const dispatchAction = {
      type: "FETCH_COUPON_BOOKS",
    };
    dispatch(dispatchAction);
  }, [year]);

  const years = allYears();

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
              helperText={error ? helpertext : ""}
            >
              {years.map((year) => (
                <MenuItem key={year.id} value={year.id}>
                  {year.year}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" sx={{ color: "red" }}>
                {helpertext}
              </Typography>
            )}
          </FormControl>
        </>
      ) : (
        <FormControl fullWidth>
          <InputLabel>Book Year</InputLabel>
          <Select
            value={yearSelected ?? ""}
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
