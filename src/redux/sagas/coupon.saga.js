import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";
import { fetchCouponFilesFailure } from "./actions";
import { formatCoupons } from "../../components/Utils/couponHelpers";
import { getMimeType } from "../../components/Utils/helpers";

// Should be changed to merchantId
const fetchPdfRequest = (couponId) => ({
  type: "FETCH_PDF_FILE",
  payload: couponId,
});

// Used in ConsumerCouponView
function* couponFiles(action) {
  const { userId, yearIds } = action.payload; // pass an array

  try {
    const queryString = yearIds.map((id) => `yearId=${id}`).join("&");
    const response = yield axios.get(
      `/api/userCoupon/${userId}?${queryString}`
    );
    // console.log("FETCH request from coupon.saga, RESPONSE = ", response.data);

    // Dispatch the successful results to the Redux store
    // Ensure data exists
    const data = response.data || [];
    // Format base coupon fields
    let formattedFiles = formatCoupons(data);

    // Add blob conversion logic
    formattedFiles = formattedFiles.map((file, idx) => {
      const coupon = data[idx]; // original coupon

      // Front view
      if (coupon.front_view_pdf?.data) {
        const frontMime = getMimeType(coupon.filename_front);

        file.frontViewBlob = new Blob(
          [Uint8Array.from(coupon.front_view_pdf.data)],
          { type: frontMime }
        );
      }

      // Back view
      if (coupon.back_view_pdf?.data) {
        const backMime = getMimeType(coupon.filename_back);

        file.backViewBlob = new Blob(
          [Uint8Array.from(coupon.back_view_pdf.data)],
          { type: backMime }
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

// Used in CouponReviewDetails and CouponReviewCard
function* pdfFile(action) {
  const payload = action.payload;

  // Distinguish between merchant ID vs coupon ID
  const merchantId = payload; // if payload is just the merchant ID
  const couponId = payload.couponId;

  try {
    const response = yield axios.get(
      merchantId.couponId
        ? `/api/coupon/details/${couponId}`
        : `/api/coupon/${merchantId}`
    );
    // console.log("FETCH request from coupon.saga, RESPONSE = ", response.data);

    // Dispatch the successful results to the Redux store
    const files = response.data;
    // Format base coupon fields
    let formattedFiles = formatCoupons(files);

    // Map the data received from the server
    formattedFiles = formattedFiles.map((file, idx) => {
      const coupon = files[idx]; // original coupon

      // Front view
      if (coupon.front_view_pdf?.data) {
        const frontMime = getMimeType(coupon.filename_front);

        file.frontViewBlob = new Blob(
          [Uint8Array.from(coupon.front_view_pdf.data)],
          { type: frontMime }
        );
      }

      // Back view
      if (coupon.back_view_pdf?.data) {
        const backMime = getMimeType(coupon.filename_back);

        file.backViewBlob = new Blob(
          [Uint8Array.from(coupon.back_view_pdf.data)],
          { type: backMime }
        );
      }

      return file;
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
  console.log("Action payload in frontViewUpload saga = ", action.payload);
  const selectedFile = action.payload.frontViewFile;
  const couponId = action.payload.couponId;
  const merchantId = action.payload.merchantId;

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    const response = yield axios.put(
      `/api/coupon/front/${couponId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // const frontViewInfo = response.data;

    // Dispatch a success action if needed
    yield put({ type: "FETCH_PDF_FILE", payload: merchantId, couponId });
    // yield put({ type: "UPLOAD_SUCCESS", payload: frontViewInfo });
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

function* backViewUpload(action) {
  const selectedFile = action.payload.backViewFile;
  const couponId = action.payload.couponId;
  const merchantId = action.payload.merchantId;

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    // console.log("formData = ", formData);
    const response = yield axios.put(`/api/coupon/back/${couponId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const backViewInfo = response.data;

    // Dispatch a success action if needed
    yield put({ type: "FETCH_PDF_FILE", payload: merchantId, couponId });
    // yield put({ type: "UPLOAD_SUCCESS", payload: backViewInfo });
  } catch (error) {
    console.error("Error uploading PDF:", error);
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
  yield takeEvery("UPLOAD_FRONT_VIEW_FILE", frontViewUpload);
  yield takeEvery("UPLOAD_BACK_VIEW_FILE", backViewUpload);
  yield takeEvery("DELETE_FILE_FRONT", deleteFileFront);
  yield takeEvery("DELETE_FILE_BACK", deleteFileBack);
}

export { fetchPdfRequest };
