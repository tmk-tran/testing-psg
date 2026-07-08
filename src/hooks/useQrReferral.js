export const useQrReferral = () => {
  const hashQuery = window.location.hash.split("?")[1] || ""; // Gets source=qr from HashRouter
  const searchParams = new URLSearchParams(hashQuery); // Parses query params

  return searchParams.get("source") === "qr"; // Detects QR flow
};
