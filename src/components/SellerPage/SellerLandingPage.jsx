import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Divider } from "@mui/material";
// ~~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~~~~~ //
import { centeredStyle, containerStyle, flexEnd } from "../Utils/pageStyles";
import { sellerPageInfo } from "../../hooks/reduxStore";
import { dispatchHook } from "../../hooks/useDispatch";
import { historyHook } from "../../hooks/useHistory";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~~~~ //
import OrgDetailsSection from "./OrgDetailsSection";
import RefIdDisplay from "./RefIdDisplay";
import PaymentMenu from "./PaymentMenu";
import { useSelector } from "react-redux";

const flexCenter = {
  display: "flex",
  justifyContent: "center",
};

export default function SellerLandingPage() {
  const dispatch = dispatchHook();
  const auth = useSelector((store) => store.auth);
  const history = historyHook();
  const paramsObject = useParams();
  console.log(paramsObject);
  const [showGoButton, setShowGoButton] = useState(false);
  console.log(showGoButton);
  const [paymentType, setPaymentType] = useState("");
  console.log(paymentType);

  useEffect(() => {
    dispatch({ type: "FETCH_SELLER_PAGEINFO", payload: {refId: paramsObject.refId, auth: auth} });
  }, []);

  const sellerData = sellerPageInfo() || [];
  console.log(sellerData);
  // Extract the seller ID //
  const [firstSeller] = sellerData;
  const sellerId = firstSeller ? firstSeller.id : null;

  // Props to PaymentMenu //
  const handlePaymentSelect = (paymentType) => {
    setShowGoButton(true);
    console.log(paymentType);
    setPaymentType(paymentType);
  };

  const navigateTo = () => {
    history.push(`/seller/${paramsObject.refId}/${paymentType}`);
  };

  return (
    <Box sx={containerStyle}>
      {sellerData.map((seller) => (
        <Box key={seller.id} sx={{ mt: 5, ...centeredStyle }}>
          <OrgDetailsSection seller={seller} />
          <br />
          <Box sx={{ ...flexCenter, width: "40%", borderRadius: "4px" }}>
            <RefIdDisplay seller={seller} />
          </Box>
          <Divider />
          <br />
          <PaymentMenu onPaymentSelect={handlePaymentSelect} />
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
