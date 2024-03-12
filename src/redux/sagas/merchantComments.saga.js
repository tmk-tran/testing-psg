import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchAllMerchantComments(action) {
  try {
    const auth_response = action.payload
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response)
    const query = `{
          merchant_comments{
        id
        merchant_id
        date
        time
        comment_content
        is_deleted
        created_at
      }
    }`

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
    console.log("FETCH request to merchantComments");
    yield put({ type: "SET_MERCHANT_COMMENTS", payload: response.data.merchant_comments });
  } catch (err) {
    console.log("error in allMerchantComments Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

function* merchantComments(action) {
  console.log(action.payload);
  try {
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response)
    const query = `{
      merchant_comments (filter: "merchant_id = ${action.payload.id} "){
        id
        merchant_id
        date
        time
        comment_content
        is_deleted
        created_at
      }
    }`

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
    console.log("FETCH request to merchantComments");
    yield put({ type: "SET_MERCHANT_COMMENTS", payload: response.data.merchant_comments });
  } catch (err) {
    console.log("error in merchantComments Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

function* addComments(action) {
  try {
    console.log(action.payload);
    yield axios.post(`/api/merchantComments/`, action.payload);
    yield put({ type: "FETCH_MERCHANT_COMMENTS", payload: action.payload });
  } catch (error) {
    console.log("error in addComments Merchant Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

export default function* merchantCommentsSaga() {
  yield takeEvery("FETCH_ALL_MERCHANT_COMMENTS", fetchAllMerchantComments);
  yield takeEvery("FETCH_MERCHANT_COMMENTS", merchantComments);
  yield takeEvery("ADD_MERCHANT_COMMENT", addComments);
}
