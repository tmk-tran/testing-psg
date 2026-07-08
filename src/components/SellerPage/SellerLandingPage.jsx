import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
// ~~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~~~~~ //
import { centeredStyle, containerStyle, flexEnd } from "../Utils/pageStyles";
import { sellerPageInfo } from "../../hooks/reduxStore";
import { dispatchHook } from "../../hooks/useDispatch";
import { historyHook } from "../../hooks/useHistory";
import { useQrReferral } from "../../hooks/useQrReferral";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~~~~ //
import OrgDetailsSection from "./OrgDetailsSection";
import RefIdDisplay from "./RefIdDisplay";
import PaymentMenu from "./PaymentMenu";

export default function SellerLandingPage() {
  const dispatch = dispatchHook();
  const history = historyHook();
  const paramsObject = useParams();
  const refId = paramsObject?.refId;
  // normalize to uppercase
  const normalizedRefId = refId?.toUpperCase();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // For QR code feature
  const isQrReferral = useQrReferral();

  const [showGoButton, setShowGoButton] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [isQRcodeVisible, setIsQRcodeVisible] = useState(false); // Controls QR modal

  useEffect(() => {
    dispatch({ type: "FETCH_SELLER_PAGEINFO", payload: normalizedRefId });
  }, []);

  const sellerData = sellerPageInfo() || [];

  // Props to PaymentMenu //
  const handlePaymentSelect = (paymentType) => {
    if (isQrReferral && paymentType === "cash") return; // Blocks cash/check from QR flow

    setShowGoButton(true);
    setPaymentType(paymentType);
  };

  const navigateTo = () => {
    const qrParam = isQrReferral ? "?source=qr" : ""; // Preserve QR source for backend/payment page

    history.push(`/seller/${paramsObject.refId}/${paymentType}${qrParam}`); // Navigate with QR source
  };

  return (
    <Box sx={containerStyle}>
      {sellerData.map((seller) => (
        <Box key={seller.id} sx={{ mt: 5, ...centeredStyle }}>
          {/* ~~~~~ OrgDetails ~~~~~ */}
          <OrgDetailsSection isMobile={isMobile} seller={seller} />
          <br />
          {/* ~~~~~ Referral ID ~~~~~ */}
          <Stack
            direction="row"
            spacing={isMobile ? 0.5 : 2}
            alignItems="center"
          >
            <RefIdDisplay
              seller={seller}
              isQRcodeVisible={isQRcodeVisible}
              onCloseQRCode={() => setIsQRcodeVisible(false)}
            />
            {/* ~~~~~ QR code icon ~~~~~ */}
            <IconButton
              size="large"
              onClick={() => setIsQRcodeVisible(true)}
              sx={{ color: "text.secondary" }}
            >
              <QrCodeIcon />
            </IconButton>
          </Stack>
          <Divider />
          <br />
          {/* ~~~~~ Payment Method ~~~~~ */}
          <PaymentMenu
            isMobile={isMobile}
            onPaymentSelect={handlePaymentSelect}
            hideCashCheck={isQrReferral} // Hide cash/check for QR visitors
          />
          <br />
          {showGoButton && (
            <Box sx={{ width: "40%", ...flexEnd }}>
              <Button variant="contained" onClick={navigateTo} fullWidth>
                Go
              </Button>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}
