import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";
import { fetchCouponFilesFailure } from "./actions";
import { formatCoupons } from "../../components/Utils/couponHelpers";

// Should be changed to merchantId
const fetchPdfRequest = (couponId) => ({
  type: "FETCH_PDF_FILE",
  payload: couponId,
});

function* couponFiles(action) {
  // const userId = action.payload.userId;
  // const yearId = action.payload.yearId;
  const { userId, yearIds } = action.payload; // pass an array
  console.log("User ID = ", userId, "Year IDs = ", yearIds);


  try {
    const queryString = yearIds.map((id) => `yearId=${id}`).join("&");
    const response = yield axios.get(`/api/userCoupon/${userId}?${queryString}`);
    // const response = yield axios.get(
    //   `/api/userCoupon/${userId}?yearId=${yearId}`
    // );
    // console.log("FETCH request from coupon.saga, RESPONSE = ", response.data);

    // Dispatch the successful results to the Redux store
    // Ensure data exists
    const data = response.data || [];
    console.log("Coupon data = ", data);

    // Format base coupon fields
    let formattedFiles = formatCoupons(data);

    // Add blob conversion logic
    formattedFiles = formattedFiles.map((file, idx) => {
      const coupon = data[idx]; // get original coupon to access PDFs

      if (coupon.front_view_pdf?.data) {
        file.frontViewBlob = new Blob(
          [Uint8Array.from(coupon.front_view_pdf.data)],
          { type: "application/pdf" }
        );
      }

      if (coupon.back_view_pdf?.data) {
        file.backViewBlob = new Blob(
          [Uint8Array.from(coupon.back_view_pdf.data)],
          { type: "application/pdf" }
        );
      }

      return file;
    });

    // console.log("FORMATTED FILES = ", formattedFiles);

    // Dispatch the formatted data to the Redux store
    yield put({ type: "SET_COUPON_FILES", payload: formattedFiles });
  } catch (error) {
    console.error("Error in coupon.saga: ", error);
    // yield put(fetchCouponFilesFailure(error.message)); // Not wired yet
  }
}

function* pdfFile(action) {
  const merchantId = action.payload;

  try {
    const response = yield axios.get(
      merchantId.couponId
        ? `/api/coupon/details/${merchantId.couponId}`
        : `/api/coupon/${merchantId}`
    );
    // console.log("FETCH request from coupon.saga, RESPONSE = ", response.data);

    // Dispatch the successful results to the Redux store
    const files = response.data;

    // Map the data received from the server
    const formattedFiles = files.map((coupon) => {
      const formattedFile = {
        id: coupon.id,
        filename: coupon.filename,
        frontViewBlob: null,
        backViewBlob: null,
        offer: coupon.offer,
        value: coupon.value,
        exclusions: coupon.exclusions,
        details: coupon.details,
        expiration: coupon.expiration,
        additionalInfo: coupon.additional_info,
        taskId: coupon.task_id,
        bookId: coupon.book_id,
        year: coupon.year,
        location_id: coupon.location_id,
        location_name: coupon.location_name,
        phone_number: coupon.phone_number,
        address: coupon.address,
        city: coupon.city,
        state: coupon.state,
        zip: coupon.zip,
        // coordinates: coupon.coordinates,
        // region_id: coupon.region_id,
        location_merchant_id: coupon.location_merchant_id,
        location_additional_details: coupon.location_additional_details,
        merchantName: coupon.merchant_name,
      };

      if (coupon.front_view_pdf && coupon.front_view_pdf.data) {
        formattedFile.frontViewBlob = new Blob(
          [Uint8Array.from(coupon.front_view_pdf.data)],
          { type: "application/pdf" }
        );
      }

      if (coupon.back_view_pdf && coupon.back_view_pdf.data) {
        formattedFile.backViewBlob = new Blob(
          [Uint8Array.from(coupon.back_view_pdf.data)],
          { type: "application/pdf" }
        );
      }

      return formattedFile;
    });

    // console.log("FORMATTED FILES = ", formattedFiles);

    yield put({ type: "SET_COUPON_FILES", payload: formattedFiles });
  } catch (error) {
    console.log("Error in GET for couponPDF by merchantId", error);
  }
}

function* addCoupon(action) {
  const coupon = action.payload;
  const merchantId = coupon.merchant_id;

  try {
    yield axios.post(`/api/coupon/`, action.payload);
    yield put({ type: "FETCH_PDF_FILE", payload: merchantId });
  } catch (error) {
    console.log("error in addCoupon Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

function* updateCoupon(action) {
  const coupon = action.payload;
  const couponId = coupon.couponId;
  const merchantId = coupon.merchantId;

  try {
    yield axios.put(`/api/coupon/${merchantId}/${couponId}`, action.payload);
    yield put({ type: "FETCH_PDF_FILE", payload: { merchantId, couponId } });
    yield put({
      type: "FETCH_YEAR_BY_ID",
      reducerType: "SET_BOOK_YEAR",
      payload: coupon.book_id,
    });
  } catch (error) {
    console.log("error in updateCoupon Saga", error);
  }
}

function* removeCoupon(action) {
  const couponId = action.payload.couponId;
  const merchantId = action.payload.merchantId;

  try {
    yield axios.put(`/api/coupon/${couponId}`);
    yield put({ type: "FETCH_PDF_FILE", payload: merchantId });
  } catch (error) {
    console.log("error in removeCoupon Saga", error);
  }
}

function* frontViewUpload(action) {
  const selectedFile = action.payload.frontViewFile;
  const selectedFileName = action.payload.frontViewFileName;
  const couponId = action.payload.id;

  try {
    const formData = new FormData();
    formData.append("pdf", selectedFile);
    // console.log("formData = ", formData);
    const response = yield axios.put(`/api/coupon/front/${couponId}`, formData);
    // console.log("RESPONSE from uploadPdf = ", response.data);
    const uploadedPdfInfo = response.data;

    // Dispatch a success action if needed
    yield put({ type: "UPLOAD_SUCCESS", payload: uploadedPdfInfo });
  } catch (error) {
    console.log("Error uploading PDF:", error);
  }
}

function* backViewUpload(action) {
  const selectedFile = action.payload.backViewFile;
  const selectedFileName = action.payload.backViewFileName;
  const couponId = action.payload.id;

  try {
    const formData = new FormData();
    formData.append("pdf", selectedFile);
    // console.log("formData = ", formData);
    const response = yield axios.put(`/api/coupon/back/${couponId}`, formData);
    // console.log("RESPONSE from uploadPdf = ", response.data);
    const uploadedPdfInfo = response.data;

    // Dispatch a success action if needed
    yield put({ type: "UPLOAD_SUCCESS", payload: uploadedPdfInfo });
  } catch (error) {
    console.log("Error uploading PDF:", error);
  }
}

function* deleteFileFront(action) {
  const couponId = action.payload;

  try {
    yield axios.delete(`/api/coupon/${couponId}/front`);
    yield put({ type: "FETCH_PDF_FILE", payload: couponId });
  } catch (error) {
    console.log("error in deleteFileFront Saga", error);
  }
}

function* deleteFileBack(action) {
  const couponId = action.payload;

  try {
    yield axios.delete(`/api/coupon/${couponId}/back`);
    yield put({ type: "FETCH_PDF_FILE", payload: couponId });
  } catch (error) {
    console.log("error in deleteFileBack Saga", error);
  }
}

export default function* couponSaga() {
  yield takeEvery("FETCH_CONSUMER_COUPONS", couponFiles);
  yield takeEvery("FETCH_PDF_FILE", pdfFile); // place this call in the component that is viewed after clicking on the file (with its id)
  yield takeEvery("ADD_COUPON", addCoupon);
  yield takeEvery("UPDATE_COUPON", updateCoupon);
  yield takeEvery("REMOVE_COUPON", removeCoupon);
  yield takeEvery("UPLOAD_FRONT_VIEW_PDF", frontViewUpload);
  yield takeEvery("UPLOAD_BACK_VIEW_PDF", backViewUpload);
  yield takeEvery("DELETE_FILE_FRONT", deleteFileFront);
  yield takeEvery("DELETE_FILE_BACK", deleteFileBack);
}

export { fetchPdfRequest };
