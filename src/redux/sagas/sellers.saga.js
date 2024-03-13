import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchSellers(action) {
  console.log(action.payload);
  try {
    console.log(action.payload);
    const orgId = action.payload.id
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{
      sellers(filter: "organization_id = ${orgId}"){
        id
        refId
        lastname
        firstname
        level
        teacher
        initial_books
        additional_books
        books_returned
        cash
        checks
        digital
        donations
        notes
        organization_id
        is_deleted
        digital_donations
        organization{
          organization_name
          address
          city
          state
          zip
        }
        transactions_collection{
          physical_book_cash
          physical_book_digital
          digital_book_credit
          seller_earnings
        }
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
    yield put({ type: "SET_SELLERS", payload: response.data.sellers })
} catch (err) {
    console.log("error in sellers Saga", err)
}
}

function* addSeller(action) {
  console.log(action.payload);
  console.log(action.payload.organization_id);
  const orgId = action.payload.organization_id;

  try {
    yield axios.post(`/api/sellers/`, action.payload);
    yield put({
      type: "FETCH_SELLERS",
      payload: orgId,
    });
  } catch (error) {
    console.log("error in addSeller Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

function* updateSeller(action) {
  console.log(action.payload);
  const sellerId = action.payload.id;
  const orgId = action.payload.organization_id;

  try {
    yield axios.put(`/api/sellers/${sellerId}`, action.payload);
    yield put({ type: "FETCH_SELLERS", payload: orgId });
  } catch (error) {
    console.log("error in updateSeller Saga", error);
    yield put({ type: "SET_ERROR", payload: error });
  }
}

function* archiveSeller(action) {
  const sellerId = action.payload.sellerId;
  const orgId = action.payload.orgId;

  try {
    const response = yield axios.delete(`/api/sellers/${sellerId}`);
    console.log(
      "DELETE request from sellers.saga, response FOR DELETE = ",
      response
    );
    yield put({ type: "FETCH_SELLERS", payload: orgId });
  } catch (error) {
    console.log("error with deleteSeller request", error);
  }
}

export default function* merchantCommentsSaga() {
  yield takeEvery("FETCH_SELLERS", fetchSellers);
  yield takeEvery("ADD_SELLER", addSeller);
  yield takeEvery("EDIT_SELLER", updateSeller);
  yield takeEvery("ARCHIVE_SELLER", archiveSeller);
}
