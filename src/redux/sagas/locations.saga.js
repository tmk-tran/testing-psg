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
    yield put({ type: "SET_LOCATIONS", payload: response.data.location })
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
    yield put({ type: "SET_LOCATIONS", payload: response.data.location })
  } catch (err) {
      console.log("error in locations Saga", err)
  }
}

function* addLocations(action) {
  try {
    const newLocation = action.payload.newLocation;
    const auth_response = action.payload.auth;
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `mutation ($input: locationInput) {
      create_location(input: $input){
        id
        merchant_id
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

    data.append("variables", JSON.stringify({
      "input": {
        "location_name": newLocation.name,
         "phone_number": Number(newLocation.phone_number),
         "address": newLocation.address,
         "city": newLocation.city,
         "state": newLocation.state,
         "zip": Number(newLocation.zit),
         "region_id": Number(newLocation.region_id),
         "merchant_id": Number(newLocation.merchant_id),
         "additional_details": newLocation.additional_details
       }
    }));

    console.log(data);

    yield axios.post(QUERY_URL, data, queryConfig);
    yield put({
      type: "FETCH_MERCHANT_LOCATIONS",
      payload: {id: newLocation.merchant_id, auth: auth_response}
    });
  } catch (error) {
    console.log("error in addLocations Saga", error);
  }
}

function* updateLocation(action) {
  try {
    const editedLocation = action.payload.editedLocation;
    const auth_response = action.payload.auth;
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `mutation ($input: locationInput $id: ID!) {
      update_location(input: $input id: $id){
        id
        merchant_id
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

    data.append("variables", JSON.stringify({
      "input": {
        "location_name": editedLocation.name,
         "phone_number": Number(editedLocation.phone_number),
         "address": editedLocation.address,
         "city": editedLocation.city,
         "state": editedLocation.state,
         "zip": Number(editedLocation.zit),
         "region_id": Number(editedLocation.region_id),
         "merchant_id": Number(editedLocation.merchant_id),
         "additional_details": editedLocation.additional_details
       },
       "id": Number(editedLocation.id)
    }));

    console.log(data);

    yield axios.post(QUERY_URL, data, queryConfig);
    yield put({
      type: "FETCH_MERCHANT_LOCATIONS",
      payload: {id: editedLocation.merchant_id, auth: auth_response}
    });
  } catch (error) {
    console.log("error in updateLocation Saga", error);
  }
}

function* deleteLocation(action) {
  try {
    const archivedLocation = action.payload.archivedLocation;
    const auth_response = action.payload.auth;
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `mutation ($input: locationInput $id: ID!) {
      update_location(input: $input id: $id){
        id
        merchant_id
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

    data.append("variables", JSON.stringify({
      "input": {
        "location_name": archivedLocation.name,
         "phone_number": Number(archivedLocation.phone_number),
         "address": archivedLocation.address,
         "city": archivedLocation.city,
         "state": archivedLocation.state,
         "zip": Number(archivedLocation.zit),
         "region_id": Number(archivedLocation.region_id),
         "merchant_id": Number(archivedLocation.merchant_id),
         "additional_details": archivedLocation.additional_details,
         "is_deleted": Boolean(archivedLocation.is_deleted)
       },
       "id": Number(archivedLocation.id)
    }));

    console.log(data);

    yield axios.post(QUERY_URL, data, queryConfig);
    yield put({
      type: "FETCH_MERCHANT_LOCATIONS",
      payload: {id: archivedLocation.merchant_id, auth: auth_response}
    });
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
