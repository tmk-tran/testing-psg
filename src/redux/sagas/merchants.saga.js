import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* merchantDetails(action) {
  console.log(action.payload);
  try {
    const refreshToken = localStorage.psg_token;
    console.log(refreshToken)
    // Login to Devii
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    const AUTH_URL = "https://api.devii.io/auth";

    const auth_response = yield axios.get(AUTH_URL, config);
    console.log(auth_response)

    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{   merchant (filter: "id = ${action.payload.id}"){
          id
          merchant_name
          address
          city
          state
          zip
          primary_contact_first_name
          primary_contact_last_name
          contact_phone_number
          contact_email
          is_deleted
          archive_reason
          merchant_logo
          filename
          website
        }
      }`;

    const queryConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    };

    const data = new FormData();
    data.append("query", query);
    data.append("variables", `{}`);

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "SET_MERCHANT_DETAILS", payload: response.data.merchant })
  } catch (err) {
    console.log("Error fetching merchant details", err)
  }
}

function* allMerchants(action) {
  try {
    const refreshToken = localStorage.psg_token;
    console.log(refreshToken)
    // Login to Devii
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    const AUTH_URL = "https://api.devii.io/auth";

    const auth_response = yield axios.get(AUTH_URL, config);
    console.log(auth_response)

    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{  merchant (filter: "is_deleted = false" ordering: "merchant_name ASC") {
      id
      merchant_name
      address
      city
      state
      zip
      primary_contact_first_name
      primary_contact_last_name
      contact_phone_number
      contact_email
      is_deleted
      archive_reason
      merchant_logo
      filename
      website
    }
  }`;

    const queryConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    };

    const data = new FormData();
    data.append("query", query);
    data.append("variables", `{}`);

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)

    yield put({ type: "SET_MERCHANTS", payload: response.data.merchant });
  } catch (error) {
    console.log("error in fetchAllMerchantsSaga", error);
  }
}


function* merchantCouponNumber(action) {
  try {
    const refreshToken = localStorage.psg_token;
    console.log(refreshToken)
    // Login to Devii
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    const AUTH_URL = "https://api.devii.io/auth";

    const auth_response = yield axios.get(AUTH_URL, config);
    console.log(auth_response)

    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response)
    const query = `{
        Aggregates{
          coupon_count: count(subquery: 
          "query{coupon{id  merchant{id}}}" 
          ordering: "merchant_id")
      }
    }`

    const queryConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    };

    const data = new FormData();
    data.append("query", query);
    data.append("variables", `{}`);

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response.data.Aggregates)
    console.log("FETCH request to merchantCouponCount");

    yield put({ type: "SET_COUPON_NUMBER", payload: response.data.Aggregates.coupon_count });

  } catch (err) {
    console.log("error in merchantCouponCount Saga", err);
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

    yield put({ type: "FETCH_MERCHANTS", payload: action.payload.auth });
  } catch (error) {
    console.log("error in merchant POST", error);
  }
}

function* editMerchant(action) {
  console.log(action.payload);
  try {
    const merchantId = Number(action.payload.editedAccount.id);
    console.log("MERCHANT ID IS", merchantId);
    // console.log("ACTION PAYLOAD IS", action.payload);
    console.log(action.payload.editedAccount);

    // Create a FormData object to send the file data
    const formData = new FormData();
    formData.append("merchant_name", action.payload.editedAccount.merchant_name);
    formData.append("address", action.payload.editedAccount.address);
    formData.append("city", action.payload.editedAccount.city);
    formData.append("state", action.payload.editedAccount.state);
    formData.append("zip", action.payload.editedAccount.zip);
    formData.append(
      "primary_contact_first_name",
      action.payload.editedAccount.primary_contact_first_name
    );
    formData.append(
      "primary_contact_last_name",
      action.payload.editedAccount.primary_contact_last_name
    );
    formData.append(
      "contact_phone_number",
      action.payload.editedAccount.contact_phone_number
    );
    formData.append("contact_email", action.payload.editedAccount.contact_email);
    formData.append("website", action.payload.editedAccount.website);
    formData.append("contact_method", action.payload.editedAccount.contact_method);

    // Check if a file is uploaded
    if (action.payload.uploadedFile) {
      formData.append("merchant_logo", action.payload.uploadedFile);
      formData.append("filename", action.payload.uploadedFile.name);
    }

    if (action.payload.merchant_logo_base64) {
      formData.append("merchant_logo", action.payload.merchant_logo_base64);
      formData.append("filename", action.payload.filename);
    }

    console.log(formData);

    const response = yield axios.put(`/api/merchants/${merchantId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
      },
    });

    console.log("RESPONSE IS", response);

    // yield put({ type: "FETCH_MERCHANT_DETAILS", payload: merchantId });
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
    const refreshToken = localStorage.psg_token;
    console.log(refreshToken)
    // Login to Devii
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    const AUTH_URL = "https://api.devii.io/auth";

    const auth_response = yield axios.get(AUTH_URL, config);
    console.log(auth_response)

    const archivedMerchant = action.payload.archivedMerchant
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response)
    const query = `
     mutation ($input: merchantInput, $id: ID!){
     update_merchant(input: $input id: $id)
   {
     id
     merchant_name
     address
     city
     state
     zip
     primary_contact_first_name
     primary_contact_last_name
     contact_phone_number
     contact_email
     merchant_logo
     is_deleted
     archive_reason
  }
}`;

    const queryConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    };

    const data = new FormData();
    data.append("query", query);
    data.append("variables", JSON.stringify({
      "input": {
        "merchant_name": archivedMerchant.merchant_name,
        "address": archivedMerchant.address,
        "city": archivedMerchant.city,
        "state": archivedMerchant.state,
        "zip": Number(archivedMerchant.zip),
        "primary_contact_first_name": archivedMerchant.primary_contact_first_name,
        "primary_contact_last_name": archivedMerchant.primary_contact_last_name,
        "contact_phone_number": archivedMerchant.contact_phone_number,
        "contact_email": archivedMerchant.contact_email,
        "is_deleted": Boolean(archivedMerchant.is_deleted),
        "archive_reason": archivedMerchant.archive_reason
      },
      "id": Number(archivedMerchant.id)
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_MERCHANTS", payload: auth_response });
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
