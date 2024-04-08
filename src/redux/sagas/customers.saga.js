import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchCustomers() {
  try {
    const items = yield axios.get(`/api/customers/`);
    console.log("FETCH request from customers.saga, ITEMS = ", items.data);
    yield put({ type: "SET_CUSTOMERS", payload: items.data });
  } catch (error) {
    console.log("error in customers Saga", error);
  }
}

function* fetchCustomerEmail(action) {
  console.log("from customers.saga, action.payload = ", action.payload);
  const customerId = action.payload.id;
  try {
    const items = yield axios.get(`/api/customers/${customerId}`);
    console.log("FETCH request from customers.saga, ITEMS = ", items.data);
    yield put({ type: "SET_CUSTOMERS", payload: items.data });
  } catch (error) {
    console.log("error in customers Saga", error);
  }
}

function* addCustomer(action) {
  console.log(action.payload);

  try {
    const response = yield axios.post(`/api/customers/`, action.payload);
    const newCustomerId = response.data[0].id;

    yield put({
      type: "FETCH_CUSTOMER_EMAIL",
      payload: {
        id: newCustomerId,
      },
    });
  } catch (error) {
    console.log("error in addCustomer Saga", error);
  }
}

export default function* customersSaga() {
  yield takeEvery("FETCH_CUSTOMERS", fetchCustomers);
  yield takeEvery("ADD_CUSTOMER", addCustomer);
  yield takeEvery("FETCH_CUSTOMER_EMAIL", fetchCustomerEmail);
}
