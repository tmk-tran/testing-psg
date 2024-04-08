import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchUserBooksSaga() {
  try {
    const response = yield axios.get("/api/userCoupon/");
    console.log(
      "FETCH request from userCoupon.saga, response = ",
      response.data
    );
    yield put({ type: "SET_CONSUMER_BOOKS", payload: response.data });
  } catch (error) {
    console.log("error in fetchUserCouponSaga", error);
  }
}

function* addCoupon(action) {
  console.log(action.payload);
  try {
    const response = yield axios.post(`/api/userCoupon/`, action.payload);
    console.log(
      "ADD request from userCoupon.saga, response FOR ADD = ",
      response
    );
    yield put({
      type: "FETCH_CONSUMER_BOOKS",
      payload: action.payload.userId,
    });
  } catch (error) {
    console.log("error with addUserCoupon request", error);
  }
}

function* releaseBook(action) {
  console.log(action.payload);
  const userId = action.payload.id;
  try {
    const response = yield axios.put(
      `/api/userCoupon/${userId}`,
      action.payload
    );
    console.log(
      "ADD request from userCoupon.saga, response FOR RELEASE = ",
      response
    );
    yield put({
      type: "FETCH_CONSUMER_BOOKS",
      payload: userId,
    });
  } catch (error) {
    console.log("error with addUserCoupon request", error);
  }
}

export default function* userCouponSaga() {
  yield takeEvery("FETCH_CONSUMER_BOOKS", fetchUserBooksSaga);
  yield takeEvery("ADD_TO_CONSUMER_LIST", addCoupon);
  yield takeEvery("RELEASE_COUPON_BOOK", releaseBook);
}
