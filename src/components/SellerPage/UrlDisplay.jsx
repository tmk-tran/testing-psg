import React, { useEffect, useState } from "react";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~~~~~~~~~~~~
import Typography from "../Typography/Typography";
import CopySnackBar from "../OrgSellers/CopySnackbar";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { transactionsUrl, orderUrl } from "./sellerUtils";

export default function UrlDisplay({ sellerRefId }) {
  console.log(sellerRefId);
  const [sellerUrl, setSellerUrl] = useState("");
  console.log(sellerUrl);
  const [urlForOrder, setUrlForOrder] = useState("");
  console.log(urlForOrder);

  useEffect(() => {
    if (sellerRefId) {
      setSellerUrl(transactionsUrl(sellerRefId));
      setUrlForOrder(orderUrl(sellerRefId));
    }
  }, [sellerRefId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sellerUrl);
  };

  const copyOrderUrl = () => {
    navigator.clipboard.writeText(urlForOrder);
  };
  return (
    <>
      <Typography
        label="Give this link to customers to purchase a book from you:"
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
        <Typography label={`${urlForOrder}`} sx={{ mt: 1 }} />
        <CopySnackBar copyToClipboard={copyOrderUrl} caseType="Display" />
      </div>
    </>
  );
}
