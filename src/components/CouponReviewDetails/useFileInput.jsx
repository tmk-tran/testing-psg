import { useState } from "react";

const useFileInput = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [addedFileName, setAddedFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAddedFileName(file.name);
    setSelectedFile(file);
  };

  return { selectedFile, addedFileName, handleFileChange };
};

export default useFileInput;
