import React from "react";
import { transactionsUrl } from "./sellerUrl";

const SellerLink = ({ seller }) => {
  const sellerUrl = transactionsUrl(seller.refId);

  return (
    <a href={sellerUrl} target="_blank" rel="noopener noreferrer">
      View Seller {sellerUrl}
    </a>
  );
};

export default SellerLink;
