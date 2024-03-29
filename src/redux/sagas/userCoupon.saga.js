import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* addCoupon(action) {
  console.log(action.payload);
  try {
    const response = yield axios.post(`/api/userCoupon/`, action.payload);
    console.log(
      "ADD request from userCoupon.saga, response FOR ADD = ",
      response
    );
    yield put({
      type: "FETCH_CONSUMER_COUPONS",
      payload: action.payload.userId,
    });
  } catch (error) {
    console.log("error with addUserCoupon request", error);
  }
}

export default function* userCouponSaga() {
  yield takeEvery("ADD_TO_CONSUMER_LIST", addCoupon);
}
