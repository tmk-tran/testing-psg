import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

// function* fetchSeller(action) {
//   try {
//     console.log(action.payload)
//     const refId = action.payload.refId;
//     const auth_response = action.payload.auth;
//     const ACCESS_TOKEN = auth_response.data.access_token;
//     const QUERY_URL = auth_response.data.routes.query;
//     const query = `{
//       sellers(filter: "refId = ${refId}"){
//         id
//         refId
//         lastname
//         firstname
//         level
//         teacher
//         initial_books
//         additional_books
//         books_returned
//         cash
//         checks
//         digital
//         donations
//         notes
//         organization_id
//         is_deleted
//         digital_donations
//         organization{
//           organization_name
//           address
//           city
//           state
//           zip
//         }
//     }
// }`;

//     const queryConfig = {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${ACCESS_TOKEN}`,
//         },
//     };

//     const data = new FormData();
//     data.append("query", query);
//     data.append("variables", `{}`);

//     const response = yield axios.post(QUERY_URL, data, queryConfig);
//     console.log(response)
//     yield put({ type: "SET_SELLER_PAGEINFO", payload: response.data.sellers })
// } catch (err) {
//     console.log("error in sellerPage Saga", err);
// }
// }

function* fetchSeller(action) {
  console.log(action.payload);
  try {
    const items = yield axios.get(`/api/seller/${action.payload}`);
    console.log("FETCH request from sellerPage.saga, ITEMS = ", items.data);
    yield put({ type: "SET_SELLER_PAGEINFO", payload: items.data });
  } catch (error) {
    console.log("error in sellerPage Saga", error);
  }
}

function* updateCash(action) {
  console.log(action.payload);
  const sellerId = action.payload.id;
  console.log(sellerId);
  const refId = action.payload.refId;
  console.log(refId);
  const orgId = action.payload.orgId;

  try {
    yield axios.put(`/api/seller/${sellerId}`, action.payload);
    yield put({ type: "FETCH_SELLERS", payload: orgId });
  } catch (error) {
    console.log("error in updateCash Saga", error);
  }
}

function* updateChecks(action) {
  const sellerId = action.payload.id;
  console.log(sellerId);
  const refId = action.payload.refId;
  console.log(refId);
  const orgId = action.payload.orgId;

  try {
    yield axios.put(`/api/seller/${sellerId}`, action.payload);
    yield put({ type: "FETCH_SELLERS", payload: orgId });
  } catch (error) {
    console.log("error in updateChecks Saga", error);
  }
}

function* updateDonations(action) {
  console.log(action.payload);
  const sellerId = action.payload.id;
  console.log(sellerId);
  const refId = action.payload.refId;
  console.log(refId);
  const orgId = action.payload.orgId;

  try {
    yield axios.put(`/api/seller/${sellerId}`, action.payload);
    yield put({ type: "FETCH_SELLERS", payload: orgId });
  } catch (error) {
    console.log("error in updateDigitalCash Saga", error);
  }
}

function* updateDigitalPayments(action) {
  console.log("DIGITAL PAYMENTS = ", action.payload);
  const sellerId = action.payload.id;
  console.log(sellerId);
  const refId = action.payload.refId;
  console.log(refId);
  // const orgId = action.payload.orgId;

  try {
    yield axios.put(`/api/seller/${sellerId}`, action.payload);
    yield put({ type: "FETCH_SELLER_PAGEINFO", payload: refId });
  } catch (error) {
    console.log("error in updateDigitalPayments Saga", error);
  }
}

export default function* sellerPageSaga() {
  yield takeEvery("FETCH_SELLER_PAGEINFO", fetchSeller);
  yield takeEvery("UPDATE_CASH", updateCash);
  yield takeEvery("UPDATE_CHECKS", updateChecks);
  yield takeEvery("UPDATE_DONATIONS", updateDonations);
  yield takeEvery("UPDATE_DIGITAL_PAYMENTS", updateDigitalPayments);
}
