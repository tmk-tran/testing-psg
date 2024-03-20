import React, { useEffect } from "react";
import { Box, Tab, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import { centeredStyle, containerStyle } from "../Utils/pageStyles";
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
        Transactions
      </Typography>
      <Box sx={{ width: "100%", mt: 2 }}>
        <TransactionsTable transactions={transactionList} />
      </Box>
    </Box>
  );
}
