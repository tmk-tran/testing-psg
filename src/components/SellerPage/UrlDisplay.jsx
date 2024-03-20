import React, { useEffect, useState } from "react";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~~~~~~~~~~~~
import Typography from "../Typography/Typography";
import CopySnackBar from "../OrgSellers/CopySnackbar";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { transactionsUrl, orderUrl } from "./sellerUrl";

export default function UrlDisplay({ sellerRefId }) {
  console.log(sellerRefId);
  const [sellerUrl, setSellerUrl] = useState("");
  console.log(sellerUrl);
  const [urlForOrder, setUrlForOrder] = useState("");
  console.log(urlForOrder);

  // Set the url for the order
  useEffect(() => {
    if (sellerRefId) {
      setSellerUrl(transactionsUrl(sellerRefId));
      setUrlForOrder(orderUrl(sellerRefId));
    }
  }, [sellerRefId]);

  const copyOrderUrl = () => {
    navigator.clipboard.writeText(urlForOrder);
  };

  return (
    <>
      <Typography
        label="Give this link to customers to purchase a book from your fundraiser:"
        variant="caption"
        sx={{ textAlign: "center" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        {/* to={`${pathForLink}`} */}
        <Typography label={`${urlForOrder}`} newTab sx={{ mt: 1 }} />
        <CopySnackBar copyToClipboard={copyOrderUrl} caseType="Display" />
      </div>
    </>
  );
}
