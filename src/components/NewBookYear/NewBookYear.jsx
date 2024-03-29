import { Box, Button, Typography } from "@mui/material";
import { border } from "../Utils/colors";
import { bookYear } from "../../hooks/reduxStore";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import NewYearForm from "./NewYearForm";
import AvailableYears from "./AvailableYears";

export default function NewBookYear() {
  const years = bookYear();
  const activeYear = years[0].year;
  console.log(activeYear);

  return (
    <Box sx={border}>
      <Typography variant="h6" sx={{ textAlign: "center" }}>
        Current book year: {activeYear}
      </Typography>
      {/* ~~~~~ Available Years ~~~~~ */}
      <AvailableYears />
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography>Start a new coupon book year</Typography>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~ Start New Year ~~~~~ */}
        <NewYearForm />
      </Box>
    </Box>
  );
}
