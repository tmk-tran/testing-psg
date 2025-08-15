import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";
import { formatCoupons } from "../../components/Utils/couponHelpers";
import { fetchCouponFilesFailure } from "./actions";

function* fetchUserBooksSaga() {
  try {
    const response = yield axios.get("/api/userCoupon/");
    // console.log(
    //   "FETCH request from userCoupon.saga, response = ",
    //   response.data
    // );
    yield put({ type: "SET_CONSUMER_BOOKS", payload: response.data });
  } catch (error) {
    console.log("error in fetchUserCouponSaga", error);
  }
}

function* fetchRedeemedCouponsSaga(action) {
  try {
    const { userId, yearId } = action.payload; // Pass both from the dispatch
    const response = yield axios.get(
      `/api/userCoupon/${userId}?yearId=${yearId}&redeemed=true`
    );
    console.log("Incoming response from fetchRedeemedCouponsSaga: ", response);

    // Ensure data exists
    const data = response.data || [];

    // Format base coupon fields
    let formattedFiles = formatCoupons(data);

    // Add blob conversion logic
    formattedFiles = formattedFiles.map((file, idx) => {
      const coupon = response.data[idx]; // get original coupon to access PDFs

      if (coupon.front_view_pdf?.data) {
        file.frontViewBlob = new Blob(
          [Uint8Array.from(coupon.front_view_pdf.data)],
          { type: "application/pdf" }
        );
      }

      if (coupon.back_view_pdf?.data) {
        file.backViewBlob = new Blob(
          [Uint8Array.from(coupon.back_view_pdf.data)],
          { type: "application/pdf" }
        );
      }

      return file;
    });

    yield put({ type: "SET_REDEEMED_COUPONS", payload: formattedFiles });
  } catch (error) {
    console.error("error in fetchRedeemedCouponsSaga", error);
    // yield put(fetchCouponFilesFailure(error.message)); Not wired yet
  }
}

function* addCoupon(action) {
  try {
    yield axios.post(`/api/userCoupon/`, action.payload);
    yield put({
      type: "FETCH_CONSUMER_BOOKS",
      payload: action.payload.userId,
    });
  } catch (error) {
    console.log("error with addUserCoupon request", error);
  }
}

function* releaseBook(action) {
  const userId = action.payload.id;
  try {
    yield axios.put(`/api/userCoupon/${userId}`, action.payload);
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
  yield takeEvery("FETCH_REDEEMED_COUPONS", fetchRedeemedCouponsSaga);
  yield takeEvery("ADD_TO_CONSUMER_LIST", addCoupon);
  yield takeEvery("RELEASE_COUPON_BOOK", releaseBook);
}
