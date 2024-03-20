import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchPaypalTransactions(action) {

  try {
    const items = yield axios.get(`/api/paypal/`);
    console.log("FETCH request from paypal.saga, ITEMS = ", items.data);
    yield put({ type: "SET_PAYPAL_TRANSACTIONS", payload: items.data });
  } catch (error) {
    console.log("error in fetchPaypalTransactions Saga", error);
  }
}

function* addPaypalTransaction(action) {
  console.log(action.payload);

    try {
      yield axios.post(`/api/paypal/`, action.payload);
      yield put({
        type: "FETCH_PAYPAL_TRANSACTIONS",
      });
    } catch (error) {
      console.log("error in addPaypal transaction Saga", error);
    }
}

export default function* paypalSaga() {
  yield takeEvery("FETCH_PAYPAL_TRANSACTIONS", fetchPaypalTransactions);
  yield takeEvery("ADD_PAYPAL_TRANSACTION", addPaypalTransaction);
}
