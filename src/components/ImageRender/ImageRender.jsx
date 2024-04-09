import React from "react";

const ImageRender = ({ base64Logo }) => {
  if (!base64Logo) {
    return null; // Return null if logo is not available
  }
  
  const hexToBase64 = (hexInput) => {
    return btoa(
      (hexInput.replace('\\x', '').match(/\w{2}/g) || [])
      .map(a => String.fromCharCode(parseInt(a, 16)))
      .join('')
    );
  };
  
var hexString = base64Logo; 
var base64String = hexToBase64(hexString);


  return (
    <img
      className="logoImage"
      src={`data:image/jpeg;base64,${base64String}`}
      alt="Organization Logo"
    />
  );
}


export default ImageRender;
