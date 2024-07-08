import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* updateTransaction(action) {
  console.log(action.payload);
  const refId = action.payload.refId;
  const orgId = action.payload.orgId;
  const yearId = action.payload.yearId;

  try {
    yield axios.put(`/api/transactions/${refId}`, action.payload);
    yield put({
      type: "FETCH_SELLERS",
      payload: { orgId, yearId },
    });
  } catch (error) {
    console.log("error in updateSeller Saga", error);
  }
}

export default function* transactionSaga() {
  yield takeEvery("UPDATE_BOOKS_SOLD", updateTransaction);
}
