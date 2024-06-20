import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchSeller(action) {
  try {
    const items = yield axios.get(`/api/seller/${action.payload}`);
    // console.log("FETCH request from sellerPage.saga, ITEMS = ", items.data);
    yield put({ type: "SET_SELLER_PAGEINFO", payload: items.data });
  } catch (error) {
    console.log("error in sellerPage Saga", error);
  }
}

function* updateCash(action) {
  console.log(action.payload);
  const sellerId = action.payload.id;
  const orgId = action.payload.orgId;
  const yearId = action.payload.yearId;

  try {
    yield axios.put(`/api/seller/${sellerId}`, action.payload);
    yield put({
      type: "FETCH_SELLERS",
      payload: { orgId: orgId, yearId: yearId },
    });
  } catch (error) {
    console.log("error in updateCash Saga", error);
  }
}

function* updateChecks(action) {
  console.log(action.payload);
  const sellerId = action.payload.id;
  const orgId = action.payload.orgId;
  const yearId = action.payload.yearId;

  try {
    yield axios.put(`/api/seller/${sellerId}`, action.payload);
    yield put({
      type: "FETCH_SELLERS",
      payload: { orgId: orgId, yearId: yearId },
    });
  } catch (error) {
    console.log("error in updateChecks Saga", error);
  }
}

function* updateDonations(action) {
  console.log(action.payload);
  const sellerId = action.payload.id;
  const orgId = action.payload.orgId;
  const yearId = action.payload.yearId;

  try {
    yield axios.put(`/api/seller/${sellerId}`, action.payload);
    yield put({
      type: "FETCH_SELLERS",
      payload: { orgId: orgId, yearId: yearId },
    });
  } catch (error) {
    console.log("error in updateDigitalCash Saga", error);
  }
}

function* updateDigitalPayments(action) {
  console.log("DIGITAL PAYMENTS = ", action.payload);
  const sellerId = action.payload.id;
  const refId = action.payload.refId;

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
