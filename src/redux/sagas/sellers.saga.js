import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

// MAY USE LATER, INACTIVE FOR NOW
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// function* getAllSellers() {
//   try {
//     const items = yield axios.get(`/api/sellers`);
//     console.log("FETCH request from sellers.saga, ITEMS = ", items.data);
//     yield put({ type: "SET_SELLERS", payload: items.data });
//   } catch (error) {
//     console.log("error in sellers Saga", error);
//   }
// }

function* fetchByName(action) {
  try {
    const items = yield axios.get(`/api/sellers/name`, {
      params: action.payload,
    });
    yield put({ type: "SET_SEARCHED_SELLER", payload: items.data });
  } catch (error) {
    console.log("error in sellers Saga", error);
  }
}

function* fetchByRefId(action) {
  console.log(action.payload);
  try {
    const items = yield axios.get(`/api/sellers/byrefid`, {
      params: action.payload,
    });
    yield put({ type: "SET_SEARCHED_SELLER", payload: items.data });
  } catch (error) {
    console.log("error in sellers Saga", error);
  }
}

function* fetchSellers(action) {
  console.log(action.payload);
  const orgId = action.payload.orgId;
  const yearId = action.payload.yearId;

  try {
    const items = yield axios.get(`/api/sellers/${orgId}/${yearId}`);
    yield put({ type: "SET_SELLERS", payload: items.data });
  } catch (error) {
    console.log("error in sellers Saga", error);
  }
}

function* addSeller(action) {
  const orgId = action.payload.organization_id;
  const yearId = action.payload.coupon_book_id;

  try {
    yield axios.post(`/api/sellers/`, action.payload);
    yield put({
      type: "FETCH_SELLERS",
      payload: { orgId, yearId },
    });
  } catch (error) {
    console.log("error in addSeller Saga", error);
  }
}

function* updateSeller(action) {
  const sellerId = action.payload.id;
  const orgId = action.payload.organization_id;
  const yearId = action.payload.yearId;

  try {
    yield axios.put(`/api/sellers/${sellerId}`, action.payload);
    yield put({ type: "FETCH_SELLERS", payload: { orgId, yearId } });
  } catch (error) {
    console.log("error in updateSeller Saga", error);
  }
}

function* archiveSeller(action) {
  const sellerId = action.payload.sellerId;
  const orgId = action.payload.orgId;

  try {
    const response = yield axios.delete(`/api/sellers/${sellerId}`);
    console.log(
      "DELETE request from sellers.saga, response FOR DELETE = ",
      response
    );
    yield put({ type: "FETCH_SELLERS", payload: orgId });
  } catch (error) {
    console.log("error with deleteSeller request", error);
  }
}

export default function* merchantCommentsSaga() {
  // yield takeEvery("FETCH_ALL_SELLERS", getAllSellers);
  yield takeEvery("FETCH_SELLER_BY_NAME", fetchByName);
  yield takeEvery("FETCH_SELLER_BY_REFID", fetchByRefId);
  yield takeEvery("FETCH_SELLERS", fetchSellers);
  yield takeEvery("ADD_SELLER", addSeller);
  yield takeEvery("EDIT_SELLER", updateSeller);
  yield takeEvery("ARCHIVE_SELLER", archiveSeller);
}
