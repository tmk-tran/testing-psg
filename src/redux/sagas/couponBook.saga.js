import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchCouponBooksSaga(action) {
    try {
        const auth_response = action.payload
        console.log(auth_response)
        const ACCESS_TOKEN = auth_response.access_token;
        const QUERY_URL = auth_response.routes.query;
        const query = "{\r\n coupon_book{\r\n id\r\n year\r\n}\r\n}";
        
        const queryConfig = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
        };

        const data = new FormData();
        data.append("query", query);
        data.append("variables", `{}`);

        const response = yield axios.post(QUERY_URL, data, queryConfig);
        console.log(response)
        yield put({ type: "SET_COUPON_BOOKS", payload: response.data.coupon_book });
    } catch (err) {
        console.log("error in fetching coupon books", err);
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
    yield takeEvery("ADD_COUPON_BOOK", addCouponBookSaga)
}