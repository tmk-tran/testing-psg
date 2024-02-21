import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchSellers(action) {
  try {
    console.log(action.payload);
    const items = yield axios.get(`/api/sellers/${action.payload}`);
    console.log("FETCH request from sellers.saga, ITEMS = ", items.data);
    yield put({ type: "SET_SELLERS", payload: items.data });
  } catch (error) {
    console.log("error in sellers Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

function* addSeller(action) {
  try {
    console.log(action.payload);
    console.log(action.payload.organization_id);
    yield axios.post(`/api/sellers/`, action.payload);
    yield put({
      type: "FETCH_SELLERS",
      payload: action.payload.organization_id,
    });
  } catch (error) {
    console.log("error in addSeller Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

// function* updateLocation(action) {
//   try {
//     console.log(action.payload);
//     // const locationId = action.payload.locationId;
//     const locationId = action.payload.editId;
//     const merchantId = action.payload.merchant_id;
//     yield axios.put(`/api/locations/${locationId}`, action.payload);
//     yield put({ type: "FETCH_MERCHANT_LOCATION", payload: merchantId });
//   } catch (error) {
//     console.log("error in updateLocation Saga", error);
//     yield put({ type: "SET_ERROR", payload: error });
//   }
// }

// function* deleteLocation(action) {
//   console.log(action.payload);
//   const locationId = action.payload.locationId;
//   console.log(locationId);
//   const merchantId = action.payload.merchantId;
//   console.log(merchantId);

//   try {
//     const response = yield axios.delete(`/api/locations/${locationId}`);
//     console.log(
//       "DELETE request from locations.saga, response FOR DELETE = ",
//       response
//     );
//     yield put({ type: "FETCH_MERCHANT_LOCATION", payload: merchantId });
//   } catch (error) {
//     console.log("error with deleteLocation request", error);
//   }
// }

export default function* merchantCommentsSaga() {
  yield takeEvery("FETCH_SELLERS", fetchSellers);
  yield takeEvery("ADD_SELLER", addSeller);
  //   yield takeEvery("EDIT_LOCATION", updateLocation);
  //   yield takeEvery("DELETE_LOCATION", deleteLocation);
}