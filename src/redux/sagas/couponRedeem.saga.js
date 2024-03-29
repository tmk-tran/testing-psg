import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* redeemCoupon(action) {
  try {
    yield axios.post(`/api/redeem/`, action.payload);
    yield put({
      type: "FETCH_CONSUMER_COUPONS",
      payload: action.payload.userId,
    });
  } catch (error) {
    console.log("error in redeem coupon Saga", error);
  }
}

export default function* merchantCommentsSaga() {
  yield takeEvery("REDEEM_COUPON", redeemCoupon);
}
