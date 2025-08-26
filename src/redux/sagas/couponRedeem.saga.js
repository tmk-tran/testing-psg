import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* redeemCoupon(action) {
  const { userId, yearId } = action.payload; // destructure
  // console.log("redeemCoupon action", action.payload);

  try {
    yield axios.post(`/api/redeem/`, action.payload);
    yield put({
      type: "FETCH_CONSUMER_COUPONS",
      payload: { userId, yearIds: [yearId] },
    });
    yield put({ type: "FETCH_REDEEMED_COUPONS", payload: { userId, yearId } });
  } catch (error) {
    console.error("error in redeem coupon Saga", error);
  }
}

export default function* merchantCommentsSaga() {
  yield takeEvery("REDEEM_COUPON", redeemCoupon);
}
