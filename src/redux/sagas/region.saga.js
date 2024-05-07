import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchRegion(action) {
  try {
    const items = yield axios.get(`/api/region`);
    yield put({ type: "SET_REGION", payload: items.data });
  } catch (error) {
    console.log("error in sellers Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

function* switchRegion(action) {
  console.log("from switchRegion Saga: ", action.payload);
  try {
    yield axios.put(`/api/region/${action.payload}`);
    yield put({ type: "FETCH_REGIONS" });
  } catch (error) {
    console.log("error in region Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

export default function* regionSaga() {
  yield takeEvery("FETCH_REGIONS", fetchRegion);
  yield takeEvery("SWITCH_REGION", switchRegion);
}
