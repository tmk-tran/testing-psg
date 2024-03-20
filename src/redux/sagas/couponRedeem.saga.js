import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* redeemCoupon(action) {
  console.log(action.payload);

  try {
    yield axios.post(`/api/redeem/`, action.payload);
    yield put({
      type: "FETCH_COUPON_FILES",
      payload: action.payload.merchant_id,
    });
  } catch (error) {
    console.log("error in redeem coupon Saga", error);
  }
}

export default function* merchantCommentsSaga() {
  yield takeEvery("REDEEM_COUPON", redeemCoupon);
}
