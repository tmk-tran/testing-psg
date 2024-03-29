import { Box } from "@mui/material";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import Typography from "../Typography/Typography";
import ToggleButton from "../ToggleButton/ToggleButton";

export default function SellersTableHeader({ viewUrlTable, setViewUrlTable }) {
  return (
    <Box sx={{ textAlign: "center", ml: 1.5 }}>
      {/* <Box sx={{ display: "flex", flexDirection: "row" }}> */}
      <Typography label="Participating Sellers" variant="h6" sx={{ p: 1 }} />
      {/* <ToggleButton
        onClick={() => setViewUrlTable(!viewUrlTable)}
        toggleState={viewUrlTable}
        label1="View URL Table"
        label2="View Seller Info"
        sxButton={{ mr: 1 }}
      /> */}
      <Typography
        label="URL can be viewed using the button in the Referral ID column "
        variant="caption"
        sx={{ mt: 2.5 }}
      />
    </Box>
  );
}
