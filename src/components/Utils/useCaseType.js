import { useState } from "react";

export const useCaseType = (initialCaseType) => {
  const [caseType, setCaseType] = useState(initialCaseType);
  console.log(caseType);

  const handleCaseTypeChange = (newValue) => {
    setCaseType(newValue);
  };

  return { caseType, handleCaseTypeChange };
};
