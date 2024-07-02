import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchCustomers() {
  try {
    const items = yield axios.get(`/api/customers/`);
    console.log("FETCH customers request from customers.saga successful");
    yield put({ type: "SET_CUSTOMERS", payload: items.data });
  } catch (error) {
    console.log("error in customers Saga", error);
  }
}

function* fetchCustomerEmail(action) {
  const customerId = action.payload.id;
  try {
    const items = yield axios.get(`/api/customers/${customerId}`);
    console.log("FETCH customerEmail request from customers.saga successful");
    yield put({ type: "SET_CUSTOMERS", payload: items.data });
  } catch (error) {
    console.log("error in customers Saga", error);
  }
}

function* addCustomer(action) {
  try {
    // Clear any existing error messages
    yield put({ type: "CLEAR_ERROR_MESSAGE" });
    const response = yield axios.post(`/api/customers/`, action.payload);

    // Email does not exist, proceed with other actions
    const newCustomerId = response.data[0].id; // Assuming response.data is an object with an 'id' property
    yield put({
      type: "FETCH_CUSTOMER_EMAIL",
      payload: {
        id: newCustomerId,
      },
    });
    // Dispatch action to indicate successful customer addition
    yield put({ type: "CUSTOMER_ADDED_SUCCESSFULLY", payload: true });
  } catch (error) {
    console.log("error in addCustomer Saga", error);
    // Handle other errors if needed
    if (error.response && error.response.data && error.response.data.error) {
      // Set an error message for the email
      yield put({
        type: "SET_ERROR_MESSAGE",
        payload: error.response.data.error,
      });
    }
    // Customer add failed
    yield put({ type: "CUSTOMER_ADDED_SUCCESSFULLY", payload: false });
    // throw error; // Throw the error to indicate failure <--- DO NOT NEED THIS!!
  }
}

export default function* merchantCommentsSaga() {
  yield takeEvery("FETCH_CUSTOMERS", fetchCustomers);
  yield takeEvery("FETCH_CUSTOMER_EMAIL", fetchCustomerEmail);
  yield takeEvery("ADD_CUSTOMER", addCustomer);
}
