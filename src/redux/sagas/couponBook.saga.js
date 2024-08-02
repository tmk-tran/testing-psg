import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchCouponBooksSaga() {
  try {
    const response = yield axios.get("/api/couponbook");
    console.log("FETCH request fetchCouponBooksSaga", response.data);
    yield put({ type: "SET_COUPON_BOOKS", payload: response.data });
  } catch (err) {
    console.log("error in fetching coupon books", err);
  }
}

function* fetchByIdSaga(action) {
  try {
    console.log(action.payload);
    const response = yield axios.get(`/api/couponbook/id/${action.payload}`);
    yield put({ type: "SET_BOOK_YEAR", payload: response.data });
  } catch (err) {
    console.log("Error fetching coupon book year by id", err);
  }
}

// Reducer is bookYear.reducer here
function* fetchByYearSaga(action) {
  try {
    const response = yield axios.get(`/api/couponbook/season`);
    yield put({ type: "SET_APP_YEAR", payload: response.data });
  } catch (err) {
    console.log("Error fetching book year", err);
  }
}

function* addCouponBookSaga(action) {
  try {
    yield axios.post("/api/couponbook");
    yield put({ type: "FETCH_COUPON_BOOKS" });
  } catch (err) {
    console.log("Error in adding a new coupon book", err);
  }
}

function* setActiveYearSaga(action) {
  const yearId = action.payload;

  try {
    yield axios.put(`/api/couponbook/id/${yearId}`);
    yield put({
      type: "FETCH_YEAR_BY_ID",
      reducerType: "SET_APP_YEAR",
      payload: yearId,
    });
  } catch (err) {
    console.log("Error in setting active year", err);
  }
}

export default function* couponBookSaga() {
  yield takeEvery("FETCH_COUPON_BOOKS", fetchCouponBooksSaga);
  yield takeEvery("FETCH_YEAR_BY_ID", fetchByIdSaga);
  yield takeEvery("FETCH_BOOK_YEAR", fetchByYearSaga);
  yield takeEvery("ADD_COUPON_BOOK", addCouponBookSaga);
  yield takeEvery("SET_ACTIVE_YEAR", setActiveYearSaga);
}
