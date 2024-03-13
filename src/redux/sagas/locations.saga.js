import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchLocations(action) {
  try {
    console.log(action.payload)
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{
      location(ordering: "id ASC"){
        id
        location_name
        phone_number
        address
        city
        state
        zip
        coordinates
        region_id
        is_deleted
        merchant_id
        additional_details
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
    yield put({ type: "SET_LOCATIONS", payload: result.data.location })
  } catch (err) {
      console.log("error in locations Saga", err)
  }
}

function* fetchMerchantLocation(action) {
  try {
    console.log(action.payload)
    const id = action.payload.id;
    const auth_response = action.payload.auth;
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{
      location (ordering: "id ASC" filter: "merchant_id = ${id}"){
        id
        location_name
        phone_number
        address
        city
        state
        zip
        coordinates
        region_id
        is_deleted
        merchant_id
        additional_details
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
    yield put({ type: "SET_LOCATIONS", payload: result.data.location })
  } catch (err) {
      console.log("error in locations Saga", err)
  }
}

function* addLocations(action) {
  try {
    console.log(action.payload);
    console.log(action.payload.merchant_id);
    yield axios.post(`/api/locations/`, action.payload);
    yield put({
      type: "FETCH_MERCHANT_LOCATIONS",
      payload: action.payload.merchant_id,
    });
  } catch (error) {
    console.log("error in addLocations Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

function* updateLocation(action) {
  try {
    console.log(action.payload);
    // const locationId = action.payload.locationId;
    const locationId = action.payload.editId;
    const merchantId = action.payload.merchant_id;
    yield axios.put(`/api/locations/${locationId}`, action.payload);
    yield put({ type: "FETCH_MERCHANT_LOCATION", payload: merchantId });
  } catch (error) {
    console.log("error in updateLocation Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

function* deleteLocation(action) {
  console.log(action.payload);
  const locationId = action.payload.locationId;
  console.log(locationId);
  const merchantId = action.payload.merchantId;
  console.log(merchantId);

  try {
    const response = yield axios.delete(`/api/locations/${locationId}`);
    console.log(
      "DELETE request from locations.saga, response FOR DELETE = ",
      response
    );
    yield put({ type: "FETCH_MERCHANT_LOCATION", payload: merchantId });
  } catch (error) {
    console.log("error with deleteLocation request", error);
  }
}

export default function* merchantCommentsSaga() {
  yield takeEvery("FETCH_LOCATIONS", fetchLocations);
  yield takeEvery("FETCH_MERCHANT_LOCATION", fetchMerchantLocation);
  yield takeEvery("ADD_LOCATION", addLocations);
  yield takeEvery("EDIT_LOCATION", updateLocation);
  yield takeEvery("DELETE_LOCATION", deleteLocation);
}
