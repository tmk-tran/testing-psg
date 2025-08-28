import { useEffect } from "react";
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
  labelOutside,
  sx,
  assignedYearId,
  setAssignedYearId,
  error,
  setActiveYearError,
  helpertext,
}) {
  const dispatch = dispatchHook();
  const years = allYears();

  useEffect(() => {
    dispatch({ type: "FETCH_COUPON_BOOKS" });
  }, []);

  const handleChange = (event) => {
    labelOutside && setActiveYearError(false);
    setAssignedYearId(event.target.value);
  };

  return (
    <Box sx={sx}>
      {labelOutside ? (
        <>
          <InputLabel>Book Year</InputLabel>
          <FormControl fullWidth>
            <Select
              value={assignedYearId}
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
            value={assignedYearId}
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
