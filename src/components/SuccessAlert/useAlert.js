import { useState } from "react";

export const useAlert = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Handler to close the alert
  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  // Handler to be called when the task is updated
  const handleTaskUpdate = (caseType) => {
    // Additional logic if needed
    setIsAlertOpen(true);
  };

  return { isAlertOpen, handleAlertClose, handleTaskUpdate };
};
