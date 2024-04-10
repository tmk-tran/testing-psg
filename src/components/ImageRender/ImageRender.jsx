import React from "react";


const ImageRender = ({ base64Logo }) => {
  if (!base64Logo) {
    return null; // Return null if logo is not available
  }
  

// OPTION 1 TO TRY!!!

const imageUrl = decodeJpegFromBytea(base64Logo)

function decodeJpegFromBytea(byteArray) {
  const blob = new Blob([byteArray], { type: 'image/jpeg' });

  const imageUrl = URL.createObjectURL(blob);

  return imageUrl;
}
// console.log(imageUrl)

// console.log(base64Logo)


  return (
    <img
      className="logoImage"
      // src={`data:image/jpeg;base64,${base64Logo}`}
      src={imageUrl}
      alt="Logo file"
    />
  );
}


export default ImageRender;
