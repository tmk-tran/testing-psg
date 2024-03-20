import React from 'react';
import { transactionsUrl } from './sellerUrl';

const SellerLink = ({ seller }) => {
    console.log(seller);
  const sellerUrl = transactionsUrl(seller.refId);
  console.log(sellerUrl);

  return (
    <a href={sellerUrl} target="_blank" rel="noopener noreferrer">
      View Seller {sellerUrl}
    </a>
  );
};

export default SellerLink;
