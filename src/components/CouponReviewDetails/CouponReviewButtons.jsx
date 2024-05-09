import React from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import { Button } from "@mui/material";
import { errorColor, successColor } from "../Utils/colors";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import { flexRowSpace } from "../Utils/pageStyles";
import { dispatchHook } from "../../hooks/useDispatch";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";

export default function CouponReviewButtons({
  onDenyButtonClick,
  isTaskUpdate,
  updateTaskState,
  changesRequested,
  completedCoupon,
  taskId,
  newTaskStatus,
  taskStatus,
  merchantId,
  setIsTaskUpdate,
  couponId,
}) {
  const dispatch = dispatchHook();

  const handleDenyClick = () => {
    // Call the parent component's function when the Deny button is clicked
    onDenyButtonClick();
  };

  const hoverDeny = {
    "&:hover": {
      backgroundColor: "#A42626", // Lighter shade for Deny button
    },
  };

  const hoverAccept = {
    "&:hover": {
      backgroundColor: "#22A422", // Lighter shade for Accept button
    },
  };

  const cancelButton = {
    backgroundColor: errorColor.color,
  };

  const buttonWidth = {
    width: "40%",
  };

  const handleCancelClick = () => {
    updateTaskState(false);
  };

  const handleUpdateClick = () => {
    const dispatchAction = {
      type: "UPDATE_MERCHANT_TASK",
      payload: {
        id: taskId,
        task: newTaskStatus,
        task_status: taskStatus,
        merchantId: merchantId,
      },
    };
    dispatch(dispatchAction);

    if (completedCoupon) {
      const dispatchAction2 = {
        type: "ADD_TO_CONSUMER_LIST",
        payload: {
          id: couponId,
        },
      };
      dispatch(dispatchAction2);
    }

    setIsTaskUpdate(false);
    showSaveSweetAlert({ label: "Task updated" });
  };

  return (
    <div style={flexRowSpace}>
      {isTaskUpdate ? (
        <>
          <Button
            onClick={handleCancelClick}
            variant="contained"
            sx={{ ...cancelButton, ...hoverDeny, ...buttonWidth }}
          >
            Cancel
          </Button>
          <Button
            onClick={!changesRequested ? handleUpdateClick : handleDenyClick}
            sx={{
              backgroundColor: successColor.color,
              ...hoverAccept,
              ...buttonWidth,
            }}
            variant="contained"
          >
            {completedCoupon ? "Complete" : "Update"}
          </Button>
        </>
      ) : (
        // <div style={{ height: "4vh", ...border }}></div>
        <>
          <Button variant="contained" sx={buttonWidth} disabled>
            Cancel
          </Button>
          <Button
            sx={{ ...buttonWidth }}
            variant="contained"
            disabled
            fullWidth
          >
            Update
          </Button>
        </>
      )}
    </div>
  );
}
