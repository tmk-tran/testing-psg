import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import { paypalTransactions } from "../../hooks/reduxStore";
// ~~~~~~~~~~ Components ~~~~~~~~~ //
import TransactionsTable from "./TransactionsTable";

export default function Transactions() {
  const dispatch = dispatchHook();

  useEffect(() => {
    dispatch({ type: "FETCH_PAYPAL_TRANSACTIONS" });
  }, []);

  const transactionList = paypalTransactions() || [];
  console.log(transactionList);

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ mt: 2, fontWeight: "bold", textAlign: "center" }}
      >
        Electronic Payment Transactions
      </Typography>
      <Box sx={{ width: "100%", mt: 2 }}>
        {transactionList.length > 0 ? (
          <TransactionsTable transactions={transactionList} />
        ) : (
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Error loading transactions
          </Typography>
        )}
      </Box>
    </Box>
  );
}
