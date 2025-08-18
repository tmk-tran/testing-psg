import { Box, Grid, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { highlightColor } from "../Utils/colors";
import { appActiveYear, bookYear } from "../../hooks/reduxStore";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import NewYearForm from "./NewYearForm";
import AvailableYearsButtons from "./AvailableYearsButtons";

const typographyStyle = {
  ...highlightColor,
  textAlign: "center",
  borderRadius: "5px",
  mt: 7,
  mb: 5,
};

export default function NewBookYear() {
  const years = appActiveYear();
  console.log("years:", years);
  const activeYearObj = years?.find((y) => y.active) || {};
  console.log("activeYearObj:", activeYearObj);
  const activeYear = activeYearObj.year || "";
  console.log("activeYear:", activeYear);
  const bookYearSee = bookYear();
  const activeYears = years?.filter((y) => y.active) || [];
const activeYearStrings = activeYears.map((y) => y.year);
console.log("activeYears:", activeYearStrings);

  return (
    <Grid container spacing={2}>
      {/* Left column */}
      <Grid item xs={6}>
        <Typography variant="h6" sx={typographyStyle}>
          Current book year: {activeYear}
        </Typography>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography>Add a new book year:</Typography>
          <NewYearForm />
        </Box>
      </Grid>
      {/* Right column */}
      <Grid item xs={6}>
        <AvailableYearsButtons activeYear={activeYearStrings} years={years} />
      </Grid>
    </Grid>
  );
}
