import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* merchantDetails(action) {
  try {
    const items = yield axios.get(`/api/merchants/${action.payload}`);
    console.log("FETCH request from merchants.saga, ITEMS = ", items.data);
    yield put({ type: "SET_MERCHANT_DETAILS", payload: items.data });
  } catch (error) {
    console.log("Error in merchantsSaga", error);
    yield put({ type: "SET_ERROR", payload: error.message });
  }
}

function* allMerchants() {
  try {
    const items = yield axios.get("/api/merchants");
    console.log("FETCH request from merchants.saga, ITEMS = ", items);
    yield put({ type: "SET_MERCHANTS", payload: items.data });
  } catch (error) {
    console.log("Error in merchantsSaga", error);
    yield put({ type: "SET_ERROR", payload: error.message });
  }
}

function* merchantCouponNumber() {
  try {
    const items = yield axios.get("/api/merchants/number");
    console.log("FETCH request from merchants.saga, ITEMS = ", items);
    yield put({ type: "SET_COUPON_NUMBER", payload: items.data });
  } catch (error) {
    console.log("Error in fetching coupon numbers, merchants saga: ", error);
  }
}

function* addMerchantSaga(action) {
  try {
    // Create a FormData object to send the file data
    const formData = new FormData();
    formData.append("merchant_name", action.payload.merchant_name);
    formData.append("address", action.payload.address);
    formData.append("city", action.payload.city);
    formData.append("state", action.payload.state);
    formData.append("zip", action.payload.zip);
    formData.append(
      "primary_contact_first_name",
      action.payload.primary_contact_first_name
    );
    formData.append(
      "primary_contact_last_name",
      action.payload.primary_contact_last_name
    );
    formData.append(
      "contact_phone_number",
      action.payload.contact_phone_number
    );
    formData.append("contact_email", action.payload.contact_email);

    // Check if a file is uploaded
    if (
      action.payload.merchant_logo !== undefined &&
      action.payload.merchant_logo !== null
    ) {
      formData.append("merchant_logo", action.payload.merchant_logo);
      formData.append("filename", action.payload.merchant_logo.name);
    }
    formData.append("website", action.payload.website);

    if (action.payload.contact_method !== null) {
      formData.append("contact_method", action.payload.contact_method);
    }

    const response = yield axios.post(`/api/merchants`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
      },
    });

    console.log("RESPONSE IS", response.rows);

    yield put({ type: "FETCH_MERCHANTS", payload: action.payload });
  } catch (error) {
    console.log("error in merchant POST", error);
  }
}

function* editMerchant(action) {
  console.log(action.payload);
  try {
    // console.log("ACTION PAYLOAD IS", action.payload);
    const merchantId = action.payload.id;

    // Create a FormData object to send the file data
    const formData = new FormData();
    formData.append("merchant_name", action.payload.merchant_name);
    formData.append("address", action.payload.address);
    formData.append("city", action.payload.city);
    formData.append("state", action.payload.state);
    formData.append("zip", action.payload.zip);
    formData.append(
      "primary_contact_first_name",
      action.payload.primary_contact_first_name
    );
    formData.append(
      "primary_contact_last_name",
      action.payload.primary_contact_last_name
    );
    formData.append(
      "contact_phone_number",
      action.payload.contact_phone_number
    );
    formData.append("contact_email", action.payload.contact_email);
    formData.append("website", action.payload.website);
    formData.append("contact_method", action.payload.contact_method);

    // Check if a file is uploaded
    if (action.payload.uploadedFile) {
      formData.append("merchant_logo", action.payload.uploadedFile);
      formData.append("filename", action.payload.uploadedFile.name);
    } else if (action.payload.merchant_logo_base64) {
      formData.append("merchant_logo", action.payload.merchant_logo_base64);
      formData.append("filename", action.payload.filename);
    }

    const response = yield axios.put(`/api/merchants/${merchantId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
      },
    });

    console.log("RESPONSE IS", response);

    yield put({ type: "FETCH_MERCHANT_DETAILS", payload: merchantId });
  } catch (error) {
    console.log("error in edit invoice", error);
  }
}

function* changeContactMethod(action) {
  const merchantId = action.payload.id;
  try {
    const response = yield axios.put(
      `/api/merchants/contact/${merchantId}`,
      action.payload
    );
    console.log("From user saga: ", response.data);
    yield put({ type: "FETCH_MERCHANT_DETAILS", payload: merchantId });
  } catch (error) {
    console.log("GET for merchant details error: ", error);
  }
}

function* deleteMerchantSaga(action) {
  const merchantId = action.payload.dataId;
  const archiveReason = action.payload.archiveReason;

  try {
    yield axios.delete(`/api/merchants/${merchantId}`, {
      data: { archiveReason },
    });
    yield put({ type: "FETCH_MERCHANTS" });
  } catch (error) {
    console.log("error with deleteMerchantSaga request", error);
  }
}

export default function* merchantDetailsSaga() {
  yield takeEvery("FETCH_MERCHANT_DETAILS", merchantDetails);
  yield takeEvery("FETCH_MERCHANTS", allMerchants);
  yield takeEvery("FETCH_COUPON_NUMBER", merchantCouponNumber);
  yield takeEvery("ADD_MERCHANT", addMerchantSaga);
  yield takeEvery("EDIT_MERCHANT_DETAILS", editMerchant);
  yield takeEvery("UPDATE_CONTACT_METHOD", changeContactMethod);
  yield takeEvery("DELETE_MERCHANT", deleteMerchantSaga);
}
