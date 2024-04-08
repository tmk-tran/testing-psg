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
        comment_content
        is_deleted
        user
        task_id
        created_at
        coupon_id
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
        comment_content
        is_deleted
        user
        task_id
        created_at
        coupon_id
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
    console.log("error in merchantComments Saga", err);
  }
}

function* couponComments(action) {
  console.log(action);
  console.log(action.payload);

  try {
    const items = yield axios.get(
      `/api/merchantComments/task/${action.payload}`
    );
    console.log("FETCH request from couponComments.saga, ITEMS = ", items.data);
    yield put({ type: "SET_MERCHANT_COMMENTS", payload: items.data });
  } catch (error) {
    console.log("error in couponComments Saga", error);
  }
}

function* addComments(action) {
  try {
    const newComment = action.payload.newComment;
    const auth_response = action.payload.auth;
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response)
    const query = `mutation ($input: merchant_commentsInput) {
      create_merchant_comments(input: $input){
        id
        merchant_id
        comment_content
        is_deleted
        user
        task_id
        created_at
        coupon_id
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
    data.append("variables", JSON.stringify({
      "input": {
        "merchant_id": Number(newComment.merchant_id),
        "comment_content": newComment.comment_content,
        "user": newComment.user,
        "task_id": Number(newComment.task_id),
        "coupon_id": Number(newComment.coupon_id)
      }
  }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    console.log("FETCH request to merchantComments");
    yield put({ type: "FETCH_MERCHANT_COMMENTS", payload: {id: newComment.merchant_id, auth: auth_response} });
  } catch (err) {
    console.log("error in addComments Merchant Saga", err);
  }
}

export default function* merchantCommentsSaga() {
  yield takeEvery("FETCH_ALL_MERCHANT_COMMENTS", fetchAllMerchantComments);
  yield takeEvery("FETCH_MERCHANT_COMMENTS", merchantComments);
  yield takeEvery("FETCH_COUPON_COMMENTS", couponComments);
  yield takeEvery("ADD_MERCHANT_COMMENT", addComments);
}
