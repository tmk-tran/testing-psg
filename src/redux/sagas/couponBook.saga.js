import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchCouponBooksSaga() {
    try {
        const response = yield axios.get("/api/couponbook");
        console.log("FETCH request fetchCouponBooksSaga");
        yield put({ type: "SET_COUPON_BOOKS", payload: response.data });
    } catch (err) {
        console.log("error in fetching coupon books", err);
    }
}

// Reducer is bookYear.reducer here
function* fetchByYearSaga(action) {
  try {
    console.log(action.payload);
    const response = yield axios.get(`/api/couponbook/${action.payload}`);
    yield put({ type: "SET_BOOK_YEAR", payload: response.data });
  } catch (err) {
    console.log("Error fetching book year", err);
  }
}

function* addCouponBookSaga(action) {
    try {
        console.log(action.payload)
        yield axios.post("/api/couponbook/newcouponbook", action.payload)
        yield put ({ type: "FETCH_COUPON_BOOKS"})
    } catch (err) {
        console.log("Error in adding a new coupon book", err)
    }
}

export default function* couponBookSaga() {
  yield takeEvery("FETCH_COUPON_BOOKS", fetchCouponBooksSaga);
  yield takeEvery("FETCH_BOOK_YEAR", fetchByYearSaga);
  yield takeEvery("ADD_COUPON_BOOK", addCouponBookSaga);
}
