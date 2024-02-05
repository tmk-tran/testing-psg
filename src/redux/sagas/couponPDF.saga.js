import axios from "axios";
import { put, takeEvery, call } from "redux-saga/effects";
import { setCouponFiles, fetchCouponFilesFailure } from "./actions";

const fetchPdfRequest = (couponId) => ({
  type: "FETCH_PDF_FILE",
  payload: couponId,
});

const fetchPdfSuccess = (pdfBlob) => ({
  type: "FETCH_PDF_SUCCESS",
  payload: pdfBlob,
});

const fetchPdf = (pdfBlob) => ({
  type: "GET_PDF",
  payload: pdfBlob,
});

const fetchPdfFailure = (error) => ({
  type: "FETCH_PDF_FAILURE",
  payload: error,
});

// function* couponFiles(action) {
//   console.log(action);

//   try {
//     const response = yield axios.get(`/api/coupon`);
//     console.log("FETCH request from couponPDF.saga, RESPONSE = ", response.data);

//     // Dispatch the successful results to the Redux store
//     const pdfData = response.data;
//     console.log("PDF DATA = ", pdfData);
//     const pdfDataArray = response.data.map((coupon) => ({
//       pdf_data: coupon.pdf_data.data,
//       filename: coupon.filename,
//     })); // Added, REMOVE IF NEEDED
//     console.log("PDF DATA ARRAY = ", pdfDataArray); // Added, REMOVE IF NEEDED
//     // yield put(setCouponFiles(pdfData));
//     // yield put({ type: "SET_COUPON_FILES", payload: pdfData });
//     yield put({ type: "SET_COUPON_FILES", payload: pdfDataArray }); // Added, REMOVE IF NEEDED
//     console.log("PDF DATA = ", pdfDataArray);
//   } catch (error) {
//     console.log("Error in couponPDF.saga: ", error);
//     yield put(fetchCouponFilesFailure(error.message));
//     // yield put(fetchPdfFailure(error.message)); // Added
//   }
// }

function* couponFiles(action) {
  console.log(action);

  try {
    const response = yield axios.get(`/api/coupon`);
    console.log("FETCH request from couponPDF.saga, RESPONSE = ", response.data);

    // Dispatch the successful results to the Redux store
    const files = response.data;

    // Convert Buffer to Blob
    const blobify = (buffer, type) => new Blob([buffer], { type });

    // Map the data received from the server
    const formattedFiles = files.map((coupon) => ({
      pdfBlob: new Blob([Uint8Array.from(coupon.pdf_data.data)], { type: 'application/pdf' }),
      filename: coupon.filename,
    }));
    console.log("FORMATTED FILES = ", formattedFiles);

    // Dispatch the formatted data to the Redux store
    yield put({ type: "SET_COUPON_FILES", payload: formattedFiles });
  } catch (error) {
    console.log("Error in couponPDF.saga: ", error);
    yield put(fetchCouponFilesFailure(error.message));
  }
}


function* pdfFile(action) {
  console.log(action);
  const couponId = action.payload;
  console.log(couponId);

  try {
    const response = yield axios.get(`/api/coupon/${couponId}`, {
      responseType: "arraybuffer",
    });
    console.log("FETCH request from coupon.saga, RESPONSE = ", response.data);

    // Dispatch success action with PDF blob data
    yield put({
      type: "GET_PDF",
      payload: new Blob([response.data], { type: "application/pdf" }),
    });
  } catch (error) {
    console.log(error);
    yield put(fetchPdfFailure(error.message));
  }
}

function* pdfUpload(action) {
  const { selectedFile } = action.payload;

  try {
    const formData = new FormData();
    formData.append("pdf", selectedFile);

    const response = yield axios.post(`/api/coupon`, formData);
    console.log("RESPONSE from uploadPdf = ", response.data);

    const uploadedPdfInfo = response.data;

    // Dispatch a success action if needed
    yield put({ type: "UPLOAD_PDF_SUCCESS", payload: uploadedPdfInfo });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    // Dispatch a failure action if needed
    yield put({ type: "UPLOAD_PDF_FAILURE", payload: "Error uploading PDF" });
  }
}

export default function* couponPDFSaga() {
  yield takeEvery("FETCH_COUPON_FILES", couponFiles); // this call will come from Coupon component
  yield takeEvery("FETCH_PDF_FILE", pdfFile); // place this call in the component that is viewed after clicking on the file (with its id)
  yield takeEvery("UPLOAD_PDF_REQUEST", pdfUpload);
}

export { fetchPdfRequest };