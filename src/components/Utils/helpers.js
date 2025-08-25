// Function to format phone number
export function formatPhoneNumber(phoneNumber) {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return "Invalid phone number";
}

// Format date to MM/DD/YYYY, used in OrgNotes component
export const formatDate = (dateString) => {
  if (!dateString) return null; // Return null if dateString is undefined or null
  const dateWithoutTime = dateString.split("T")[0]; // Extract only the date part
  const [year, month, day] = dateWithoutTime.split("-");
  return `${month}/${day}/${year}`;
};

export const convertTo12HourFormat = (time24hr) => {
  const [hours, minutes] = time24hr.split(":");
  const dummyDate = new Date(0, 0, 0, hours, minutes);
  const time12hr = dummyDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return time12hr;
};

export const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${formattedDate} ${formattedTime}`;
};

// Function to capitalize the first letter of each word
export const capitalizeWords = (sentence) => {
  return sentence
    ? sentence
        .split(" ")
        .map((word) =>
          word.length === 1
            ? word.toUpperCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    : "";
};

export const capitalizeFirstWord = (sentence) => {
  if (typeof sentence !== "string" || sentence.length === 0) {
    return "";
  }

  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

export function capitalize(str) {
  return str.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

export function capitalizeStateAbbr(abbr) {
  if (abbr == null) {
    return "";
  }
  return abbr.slice(0, 2).toUpperCase();
}

// In progress, trying to account for acronyms in a sentence
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// export const capitalizeWords = (sentence) => {
//   return sentence
//     ? sentence
//         .split(" ")
//         .map((word) => {
//           // Check if the word is an acronym (all uppercase and at least 2 characters)
//           if (/^[A-Z]+$/.test(word) && word.length >= 2) {
//             return word; // If it's an acronym, leave it unchanged
//           } else {
//             // Convert the word to lowercase
//             return word.toLowerCase();
//           }
//         })
//         .join(" ")
//     : "";
// };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Style for Modal in OrgGroupInfo
export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
  // height: "50vh",
  display: "flex",
  flexDirection: "column",
  // Media query for smaller screens
  "@media (max-width: 700px)": {
    height: "80vw",
    width: "90vw", // Adjust the width for smaller screens
    maxWidth: "50vw", // Adjust the maximum width for smaller screens
    maxHeight: "100vw",
  },
  "@media (max-width: 400px)": {
    height: "100vw",
  },
};

export const styleFlexBox = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
  alignItems: "center",
};

// Style for images
export const styleImage = {
  width: "400px",
  height: "220px",
  objectFit: "contain",
};

// Center style for table cells, and list items in OrgContactDetails component
export const centerStyle = {
  textAlign: "center",
};

// Style for hr lines in Notes and Task display
export const hrStyle = {
  width: "90%",
  border: "1px solid #273b91",
};

// Tab width for Tabs in TaskTabs, and HomePageTabs
export const tabWidth = {
  width: "25vw",
};

// Validate phone number format
export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]*$/;
  return phoneRegex.test(phoneNumber) && phoneNumber.length === 10;
};

// export const validatePhoneNumber = (phoneNumber) => {
//   return /^[0-9]*$/.test(phoneNumber);
// };

// Validate email address format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email === "" || emailRegex.test(email);
};

// Validate website address format
export const validateWebsiteFormat = (website) => {
  // Regex to match a URL with optional http/https, optional www, domain, TLD, and optional path
  const websiteRegex =
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
  return websiteRegex.test(website);
};

// Spacing for buttons with AddBoxIcons
export const buttonIconSpacing = {
  marginRight: "5px",
};

// Button width for save button in modals
export const saveBtnWidth = {
  width: "60%",
};

// Handle caseType change
export const handleCaseTypeChange = (newValue) => {
  setCaseType(newValue);
};

export const getExpirationYear = (bookYearData) => {
  const years = bookYearData[0].year;
  const expirationYear = years.split("-")[1];
  return expirationYear;
};

// Season function
export const getCurrentSeason = () => {
  // Fetch the current year
  const currentYear = new Date().getFullYear();

  // Fetch the current date
  const currentDate = new Date();

  // Determine the current season based on the current date
  let currentSeason;
  if (
    currentDate >= new Date(`${currentYear - 1}-09-02`) &&
    currentDate <= new Date(`${currentYear}-09-01`)
  ) {
    // Season starts after September 1st
    currentSeason = `${currentYear - 1}-${currentYear}`;
  } else {
    currentSeason = `${currentYear}-${currentYear + 1}`;
  }

  return currentSeason;
};

// Date change function
export const handleDateChange = (date, setState) => {
  const formattedDate = date.$d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  setState(formattedDate);
};

// ----- Image helpers ----------
export const checkFileType = (file) => {
  if (!file) return { isPdf: false, isJpg: false };

  if (file instanceof Blob) {
    return {
      isPdf: file.type === "application/pdf",
      isJpg: file.type.startsWith("image/"),
    };
  }

  if (typeof file === "string") {
    return {
      isPdf: file.endsWith(".pdf"),
      isJpg: file.endsWith(".jpg") || file.endsWith(".jpeg"),
    };
  }

  return { isPdf: false, isJpg: false };
};

export const getImageSrc = (imageData) => {
  if (!imageData) return "";

  if (typeof imageData === "string") {
    // prod URL
    return imageData;
  }

  if (imageData instanceof Blob) {
    // dev blob
    return URL.createObjectURL(imageData);
  }

  return "";
};

export const getFileSrc = ({ url, blob }) => {
  if (url) return url;          // Prefer URL
  if (blob instanceof Blob) return URL.createObjectURL(blob); // Fallback to Blob
  return "";
};

// helper to decide MIME type based on filename
export const getMimeType = (filename) => {
  if (!filename) return "application/pdf"; // default
  const lower = filename.toLowerCase();

  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".pdf")) return "application/pdf";
  // if (lower.endsWith(".png")) return "image/png"; // Future enhancement

  return "application/octet-stream"; // fallback
};

// END: Image helpers ----------
