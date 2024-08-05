import React from "react";
import Button from "@mui/material/Button";
import { historyHook } from "../../hooks/useHistory";

const NewOrderButton = ({ refId }) => {
  const history = historyHook();
  const startNewOrder = () => {
    history.push(`/seller/${refId}/`);
  };

  return (
    <Button variant="contained" onClick={startNewOrder} color="primary">
      Start a new order
    </Button>
  );
};

export default NewOrderButton;
