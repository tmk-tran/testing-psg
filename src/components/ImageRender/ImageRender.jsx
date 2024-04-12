import React from "react";

const ImageRender = ({ base64Logo }) => {
  if (!base64Logo) {
    return null; // Return null if logo is not available
  }

  return (
    <img
      className="logoImage"
      src={`data:image/jpeg;base64,${base64Logo}`}
      // src={imageUrl}
      alt="Logo file"
    />
  );
};

export default ImageRender;
