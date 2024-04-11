import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchCouponBooksSaga(action) {
  try {
    const refreshToken = localStorage.psg_token;
    console.log(refreshToken)
    // Login to Devii
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    const AUTH_URL = "https://api.devii.io/auth";

    const auth_response = yield axios.get(AUTH_URL, config);
    console.log(auth_response)

    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{
      coupon_book (ordering: "id desc"){
        id
        year
        active
      }
  }`;

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
// function* fetchByYearSaga(action) {
//   try {
//     console.log(action.payload)
//     const currentSeason = action.payload.currentSeason;
//     const auth_response = action.payload.auth;
//     const ACCESS_TOKEN = auth_response.data.access_token;
//     const QUERY_URL = auth_response.data.routes.query;
//     const query = `{
//       coupon_book (filter: "year = '${currentSeason}'"){
//         id
//         year
//         active
//       }
//   }`;

//     const queryConfig = {
//       headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${ACCESS_TOKEN}`,
//       },
//   };

//   const data = new FormData();
//   data.append("query", query);
//   data.append("variables", `{}`);

//   const response = yield axios.post(QUERY_URL, data, queryConfig);
//   console.log(response)

//     yield put({ type: "SET_BOOK_YEAR", payload: response.data.coupon_book });
//   } catch(err) {
//     console.log("error in fetching coupon book year", err);
//   }
// }

function* fetchByYearSaga(action) {
  try {
    const refreshToken = localStorage.psg_token;
    console.log(refreshToken)
    // Login to Devii
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    const AUTH_URL = "https://api.devii.io/auth";

    const auth_response = yield axios.get(AUTH_URL, config);
    console.log(auth_response)

    const currentSeason = action.payload.currentSeason;
    if (auth_response && Object.keys(auth_response).length > 0) {
      // Auth exists and is not empty
      const ACCESS_TOKEN = auth_response.data.access_token;
      const QUERY_URL = auth_response.data.routes.query;
      const query = `{
        coupon_book (filter: "year = '${currentSeason}'"){
          id
          year
          active
        }
      }`;

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
      console.log(response);

      yield put({ type: "SET_BOOK_YEAR", payload: response.data.coupon_book });
    } else {
      // Auth is empty or does not exist
      const response = yield axios.get(`/api/couponbook/season/${currentSeason}`);
      console.log(response.data);
      yield put({ type: "SET_BOOK_YEAR", payload: response.data });
    }
  } catch (err) {
    console.log("Error in fetching book year", err);
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
    yield put({ type: "FETCH_YEAR_BY_ID", payload: yearId });
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
