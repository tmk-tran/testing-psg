import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* redeemCoupon(action) {
  const userId = action.payload.userId;
  const yearId = action.payload.yearId;

  try {
    yield axios.post(`/api/redeem/`, action.payload);
    yield put({
      type: "FETCH_CONSUMER_COUPONS",
      payload: { userId: userId, yearId: yearId },
    });
  } catch (error) {
    console.log("error in redeem coupon Saga", error);
  }
}

export default function* merchantCommentsSaga() {
  yield takeEvery("REDEEM_COUPON", redeemCoupon);
}
