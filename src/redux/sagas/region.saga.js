import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchRegion(action) {
  try {
    const items = yield axios.get(`/api/region`);
    console.log("FETCH request from region.saga, ITEMS = ", items.data);
    yield put({ type: "SET_REGION", payload: items.data });
  } catch (error) {
    console.log("error in sellers Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

export default function* regionSaga() {
  yield takeEvery("FETCH_REGIONS", fetchRegion);
}
