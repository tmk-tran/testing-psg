import React from "react";

const ImageRender = ({ base64Logo }) => {
  if (!base64Logo) {
    return null; // Return null if logo is not available
  }

//ANOTHER OPTION THAT I HOPE WORKS
function hexToBase64(hexString) {
  if (!hexString || hexString.length % 2 !== 0) {
    return null; // Input validation: check for empty string and odd length
  }
  try {
    // Convert hex string to byte array (Uint8Array)
    const byteArray = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < byteArray.length; i++) {
      byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
    }
    // Encode byte array to base64 string
    return btoa(String.fromCharCode(...byteArray));
  } catch (error) {
    console.error("Error decoding hex data:", error);
    return null;
  }
}

const hexString = base64Logo;
const base64Data = hexToBase64(hexString);

// if (base64Data) {
//   console.log("Base64 encoded data:", base64Data);
// } else {
//   console.error("Error: Invalid hexadecimal data");
// }

  const byteArray = atob(base64Data);

  const imageUrl = decodeJpegFromBytea(byteArray);

// OPTION 1 TO TRY!!!

function decodeJpegFromBytea(byteArray) {
  // Existing logic to convert byte array to image URL
  const blob = new Blob([byteArray], { type: "image/jpeg" });
  const imageUrl = URL.createObjectURL(blob);
  return imageUrl;
}

// console.log(imageUrl)

// console.log(base64Logo)

  return (
    <img
      className="logoImage"
      // src={`data:image/jpeg;base64,${base64Data}`}
      src={imageUrl}
      alt="Logo file"
    />
  );
  }

export default ImageRender;

// import React from "react";

// const ImageRender = ({ base64Logo }) => {
//   console.log(base64Logo);

//   // Verify if base64Logo is a valid base64 string
//   if (!base64Logo.startsWith("data:image/png;base64,")) {
//     return <div>Invalid base64 format</div>;
//   }

//   return <img className="logoImage" src={`data:image/png;base64,${base64Logo}`} alt="Logo file" />;
// };

// export default ImageRender;
