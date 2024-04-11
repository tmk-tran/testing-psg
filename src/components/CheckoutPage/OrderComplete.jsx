import { useParams } from "react-router-dom";
import { Box, Typography as MuiTypography } from "@mui/material";
// ~~~~~~~~~ Hooks ~~~~~~~~~ //
import { centeredStyle } from "../Utils/pageStyles";
// ~~~~~~~~~ Components ~~~~~~~~~ //
import NewOrderButton from "./NewOrderButton";
import Typography from "../Typography/Typography";
import { customerList, digitalBookTypeSold } from "../../hooks/reduxStore";

const boldCenter = {
  fontWeight: "bold",
  textAlign: "center",
};

export default function OrderComplete() {
  const seller = useParams();
  const refId = seller.refId;
  const customerAddressInfo = customerList() || [];
  const digitalBookType = digitalBookTypeSold() || [];

  // Typography here is a CUSTOM component //
  // MuiTypography is MUI default component //
  return (
    <>
      <Box sx={centeredStyle}>
        <Typography
          label="Thank you for your purchase!"
          variant="h6"
          sx={{ mt: 10 }}
        />
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Address Display ~~~~~~~~~~ */}
        {customerAddressInfo.map((customer) => (
          <MuiTypography
            key={customer.email}
            variant="body2"
            sx={{ mt: 5, mb: 5 }}
          >
            {digitalBookType.digitalBookCredit === true && (
              <>
                Your digital coupon book will be sent to:{" "}
                <Typography label={`${customer.email}`} sx={boldCenter} />
              </>
            )}
            <br />
            {digitalBookType.physicalBookCash === true && (
              <>
                Your physical coupon book will be sent to:{" "}
                <Typography
                  label={`
                  ${customer.address} ${customer.unit} 
                `}
                  sx={boldCenter}
                />
                <Typography
                  label={`${customer.city}
                  ${customer.state}, ${customer.zip}`}
                  sx={boldCenter}
                />
              </>
            )}
          </MuiTypography>
        ))}
        <Typography
          label="You may now close this window, or..."
          variant="caption"
        />
      </Box>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Button ~~~~~~~~~~ */}
      <Box
        sx={{
          mt: 3,
          ...centeredStyle,
        }}
      >
        <NewOrderButton refId={refId} />
      </Box>
    </>
  );
}
