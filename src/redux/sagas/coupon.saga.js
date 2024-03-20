import axios from "axios";
import { put, takeEvery, call } from "redux-saga/effects";
import { setCouponFiles, fetchCouponFilesFailure } from "./actions";

const fetchPdfRequest = (couponId) => ({
  type: "FETCH_PDF_FILE",
  payload: couponId,
});

function* couponFiles(action) {
  console.log(action);

  try {
    const response = yield axios.get(`/api/coupon`);
    console.log("FETCH request from coupon.saga, RESPONSE = ", response.data);

    // Dispatch the successful results to the Redux store
    const files = response.data;

    // Map the data received from the server
    const formattedFiles = files.map((coupon) => {
      const formattedFile = {
        id: coupon.id,
        merchantId: coupon.merchant_id,
        is_deleted: coupon.is_deleted,
        frontViewBlob: null,
        backViewBlob: null,
        offer: coupon.offer,
        value: coupon.value,
        exclusions: coupon.exclusions,
        expiration: coupon.expiration,
        additionalInfo: coupon.additional_info,
        locationId: coupon.location_id,
        locationName: coupon.location_name,
        phoneNumber: coupon.phone_number,
        address: coupon.address,
        city: coupon.city,
        state: coupon.state,
        zip: coupon.zip,
        // coordinates: coupon.coordinates,
        // regionId: coupon.region_id,
        locationMerchantId: coupon.location_merchant_id,
        additionalDetails: coupon.location_additional_details,
        merchantName: coupon.merchant_name,
        is_redeemed: coupon.is_redeemed,
      };

      // if (coupon.pdf_data && coupon.pdf_data.data) {
      //   formattedFile.pdfBlob = new Blob(
      //     [Uint8Array.from(coupon.pdf_data.data)],
      //     { type: "application/pdf" }
      //   );
      // }

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

    console.log("FORMATTED FILES = ", formattedFiles);

    // Dispatch the formatted data to the Redux store
    yield put({ type: "SET_COUPON_FILES", payload: formattedFiles });
  } catch (error) {
    console.log("Error in coupon.saga: ", error);
    yield put(fetchCouponFilesFailure(error.message));
  }
}

function* pdfFile(action) {
  console.log(action);
  const merchantId = action.payload;
  console.log(merchantId);

  try {
    // const response = yield axios.get(`/api/coupon/${merchantId}`);
    const response = yield axios.get(
      merchantId.couponId
        ? `/api/coupon/details/${merchantId.couponId}`
        : `/api/coupon/${merchantId}`
    );
    console.log("FETCH request from coupon.saga, RESPONSE = ", response.data);

    // Dispatch the successful results to the Redux store
    const files = response.data;

    // Map the data received from the server
    const formattedFiles = files.map((coupon) => {
      const formattedFile = {
        id: coupon.id,
        pdfBlob: null,
        filename: coupon.filename,
        frontViewBlob: null,
        backViewBlob: null,
        offer: coupon.offer,
        value: coupon.value,
        exclusions: coupon.exclusions,
        details: coupon.details,
        expiration: coupon.expiration,
        additionalInfo: coupon.additional_info,
        location_id: coupon.location_id,
        location_name: coupon.location_name,
        phone_number: coupon.phone_number,
        address: coupon.address,
        city: coupon.city,
        state: coupon.state,
        zip: coupon.zip,
        coordinates: coupon.coordinates,
        region_id: coupon.region_id,
        location_merchant_id: coupon.location_merchant_id,
        location_additional_details: coupon.location_additional_details,
      };

      if (coupon.pdf_data && coupon.pdf_data.data) {
        formattedFile.pdfBlob = new Blob(
          [Uint8Array.from(coupon.pdf_data.data)],
          { type: "application/pdf" }
        );
      }

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

    console.log("FORMATTED FILES = ", formattedFiles);

    yield put({ type: "SET_COUPON_FILES", payload: formattedFiles });
  } catch (error) {
    console.log("Error in GET for couponPDF by merchantId", error);
  }
}

function* addCoupon(action) {
  const coupon = action.payload;
  console.log(coupon);
  const merchantId = coupon.merchant_id;
  console.log(merchantId);

  try {
    yield axios.post(`/api/coupon/`, action.payload);
    yield put({ type: "FETCH_PDF_FILE", payload: merchantId });
  } catch (error) {
    console.log("error in addCoupon Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

function* frontViewUpload(action) {
  console.log(action.payload);
  const selectedFile = action.payload.frontViewFile;
  console.log(selectedFile);
  const selectedFileName = action.payload.frontViewFileName;
  console.log(selectedFileName);
  const couponId = action.payload.id;
  console.log(couponId);

  try {
    const formData = new FormData();
    formData.append("pdf", selectedFile);
    console.log("formData = ", formData);

    const response = yield axios.put(`/api/coupon/front/${couponId}`, formData);
    console.log("RESPONSE from uploadPdf = ", response.data);

    const uploadedPdfInfo = response.data;

    // Dispatch a success action if needed
    yield put({ type: "UPLOAD_SUCCESS", payload: uploadedPdfInfo });
  } catch (error) {
    console.log("Error uploading PDF:", error);
  }
}

function* backViewUpload(action) {
  console.log(action.payload);
  const selectedFile = action.payload.backViewFile;
  console.log(selectedFile);
  const selectedFileName = action.payload.backViewFileName;
  console.log(selectedFileName);
  const couponId = action.payload.id;
  console.log(couponId);

  try {
    const formData = new FormData();
    formData.append("pdf", selectedFile);
    console.log("formData = ", formData);

    const response = yield axios.put(`/api/coupon/back/${couponId}`, formData);
    console.log("RESPONSE from uploadPdf = ", response.data);

    const uploadedPdfInfo = response.data;

    // Dispatch a success action if needed
    yield put({ type: "UPLOAD_SUCCESS", payload: uploadedPdfInfo });
  } catch (error) {
    console.log("Error uploading PDF:", error);
  }
}

function* updateCoupon(action) {
  const coupon = action.payload;
  console.log(coupon);
  const couponId = coupon.couponId;
  console.log(couponId);
  const merchantId = coupon.merchantId;

  try {
    yield axios.put(`/api/coupon/${merchantId}/${couponId}`, action.payload);
    yield put({ type: "FETCH_PDF_FILE", payload: { merchantId, couponId } });
  } catch (error) {
    console.log("error in updateCoupon Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

export default function* couponSaga() {
  yield takeEvery("FETCH_COUPON_FILES", couponFiles); // this call will come from Coupon component
  yield takeEvery("FETCH_PDF_FILE", pdfFile); // place this call in the component that is viewed after clicking on the file (with its id)
  yield takeEvery("ADD_COUPON", addCoupon);
  yield takeEvery("UPLOAD_FRONT_VIEW_PDF", frontViewUpload);
  yield takeEvery("UPLOAD_BACK_VIEW_PDF", backViewUpload);
  yield takeEvery("UPDATE_COUPON", updateCoupon);
}

export { fetchPdfRequest };
