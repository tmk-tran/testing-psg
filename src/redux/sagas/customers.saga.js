import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchCustomers() {
  try {
    console.log(action.payload)
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{
      customers (ordering: "last_name ASC"){
        id
        refId
        last_name
        first_name
        phone
        created
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
    yield put({ type: "SET_LOCATIONS", payload: response.data.customers })
  } catch (err) {
      console.log("error in locations Saga", err)
  }
}

function* addCustomer(action) {
  try {
    const newCustomer = action.payload.newCustomer;
    const auth_response = action.payload.auth;
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `mutation ($input: customersInput) {
      create_customers(input: $input ){
        id
         refId
        last_name
        first_name
        phone
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

    data.append("variables", JSON.stringify({
      "input": {
        "refId": newCustomer.refId,
         "last_name": newCustomer.last_name,
         "first_name": newCustomer.first_name,
         "phone": Number(newCustomer.phone)
       }
    }));

    console.log(data);

    yield axios.post(QUERY_URL, data, queryConfig);
    yield put({
      type: "FETCH_CUSTOMERS",
      payload: auth_response
    });
  } catch (error) {
    console.log("error in addCustomer Saga", error);
  }
}

export default function* merchantCommentsSaga() {
  yield takeEvery("FETCH_CUSTOMERS", fetchCustomers);
  yield takeEvery("ADD_CUSTOMER", addCustomer);
}
