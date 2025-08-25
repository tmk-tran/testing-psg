import { useState, useEffect } from "react";
import { checkFileType, getFileSrc } from "../components/Utils/helpers";

export function useFilePreview(fileObj) {
  const [frontSrc, setFrontSrc] = useState("");
  const [backSrc, setBackSrc] = useState("");

  // Determine file type based on whichever exists first
  const frontType = checkFileType(
    fileObj?.frontViewUrl || fileObj?.frontViewBlob
  );
  const backType = checkFileType(fileObj?.backViewUrl || fileObj?.backViewBlob);

  useEffect(() => {
    const front = getFileSrc({
      url: fileObj?.frontViewUrl,
      blob: fileObj?.frontViewBlob,
    });
    const back = getFileSrc({
      url: fileObj?.backViewUrl,
      blob: fileObj?.backViewBlob,
    });

    setFrontSrc(front);
    setBackSrc(back);

    return () => {
      if (fileObj?.frontViewBlob && !fileObj?.frontViewUrl)
        URL.revokeObjectURL(front);
      if (fileObj?.backViewBlob && !fileObj?.backViewUrl)
        URL.revokeObjectURL(back);
    };
  }, [
    fileObj?.frontViewBlob,
    fileObj?.backViewBlob,
    fileObj?.frontViewUrl,
    fileObj?.backViewUrl,
  ]);

  return { frontSrc, backSrc, frontType, backType };
}
