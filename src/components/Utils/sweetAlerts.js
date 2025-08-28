import Swal from "sweetalert2";
import { primaryColor, successColor } from "./colors";

export const showDeleteSweetAlert = (deleteCall, caseType) => {
  let title = "";
  let confirmButtonText = "";
  switch (caseType) {
    case "archive":
      title = "Are you sure?";
      confirmButtonText = "Yes, archive it!";
      break;
    case "archiveStudent":
      title = "Archive seller?";
      confirmButtonText = "Confirm";
      break;
    case "delete":
      title = "Delete note?";
      confirmButtonText = "Yes, delete it!";
      break;
    case "removeLocation":
      title = "Remove location?";
      confirmButtonText = "Confirm";
      break;
    case "removeOrgAdmin":
      title = "Remove Organization?";
      confirmButtonText = "Confirm";
      break;
    case "deleteUser":
      title = "Delete User?";
      confirmButtonText = "Confirm";
      break;
    case "removeImage":
      title = "Delete Image?";
      confirmButtonText = "Confirm";
      break;
    case "removeCoupon":
      title = "Delete coupon?";
      confirmButtonText = "Confirm";
      break;
    default:
      title = "Are you sure?";
      confirmButtonText = "Yes, confirm it!";
      break;
  }
  Swal.fire({
    // title: "Are you sure?",
    title: title,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: successColor.color,
    cancelButtonColor: "#d33",
    confirmButtonText: confirmButtonText,
  }).then((result) => {
    if (result.isConfirmed) {
      // Execute the callback if the user confirms
      deleteCall && deleteCall();
      Swal.fire({
        title:
          caseType === "removeOrgAdmin"
            ? "Removed!"
            : caseType === "deleteUser" || caseType === "removeImage"
            ? "Deleted!"
            : "Archived!",
        icon: "success",
        confirmButtonColor: primaryColor.color,
      });
    }
  });
};

// Sweet Alert in OrgContactDetailsEdit
// export const showSaveSweetAlert = () => {
//   Swal.fire({
//     title: "Saved!",
//     icon: "success",
//     confirmButtonColor: primaryColor.color,
//   });
// };
export const showSaveSweetAlert = ({ label }) => {
  const title = label !== null ? `${label}!` : "Saved!";
  Swal.fire({
    title: title,
    icon: "success",
    confirmButtonColor: primaryColor.color,
  });
};

// Sweet Alert for RequestBooks.jsx
export const submitPaymentSweetAlert = (saveCall) => {
  Swal.fire({
    title: "Cash or check received?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: successColor.color,
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      // Execute the callback if the user confirms
      saveCall && saveCall();
      Swal.fire({
        title: "Sale Complete!",
        icon: "success",
        confirmButtonColor: primaryColor.color,
      });
    }
  });
};

// Sweet Alert for CouponCard.jsx
export const redeemCouponSweetAlert = (saveCall) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: successColor.color,
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Redeem Coupon",
  }).then((result) => {
    if (result.isConfirmed) {
      // Execute the callback if the user confirms
      saveCall && saveCall();
      Swal.fire({
        title: "Coupon Redeemed!",
        icon: "success",
        confirmButtonColor: primaryColor.color,
      });
    }
  });
};
