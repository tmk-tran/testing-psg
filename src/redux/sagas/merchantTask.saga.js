import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* merchantTask(action) {
  console.log(action.payload);
  try {
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `query {
      merchant_tasks (filter: "merchant_id = ${action.payload.id}" ordering: "due_date ASC"){
        id
        category
        task
        merchant_id
        merchant_name
        assign
        due_date
        description
        task_status
        coupon_details
        is_deleted
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
    console.log("FETCH request from merchantTask.saga, ITEMS = ", response.data);
    yield put({ type: "SET_MERCHANT_TASKS", payload: response.data.merchant_tasks });
  } catch (error) {
    console.log("error in merchantTasks Saga", error);
  }
}

function* fetchAllMerchantTasks(action) {
  console.log(action.payload);
  try {
    const auth_response = action.payload
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `query {
      merchant_tasks (ordering: "due_date ASC"){
        id
        category
        task
        merchant_id
        merchant_name
        assign
        due_date
        description
        task_status
        coupon_details
        is_deleted
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
    console.log("FETCH request from allMerchantTask.saga, ITEMS = ", response.data);
    yield put({ type: "SET_MERCHANT_TASKS", payload: response.data.merchant_tasks });
  } catch (error) {
    console.log("error in allMerchantTasks Saga", error);
  }
}

function* addMerchantTask(action) {
  try {
    const newTask = action.payload.newTask
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `mutation($input: merchant_tasksInput){
      create_merchant_tasks (input: $input){
        id
        category
        task
        merchant_id
        merchant_name
        assign
        due_date
        description
        task_status
        coupon_details
        is_deleted
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
        "category": newTask.category,
        "task": newTask.task,
        "merchant_id": Number(newTask.merchant_id),
        "merchant_name": newTask.merchant_name,
        "assign": newTask.assign,
        "due_date": newTask.due_date,
        "description": newTask.description,
        "task_status": newTask.task_status
      }
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_ALL_MERCHANT_TASKS", payload:  auth_response  });
  } catch (error) {
    console.log("error in addNotes Saga", error);
  }
}

function* editMerchantTask(action) {
  try {
    const updatedTask = action.payload.updatedTask
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = ` mutation ($input: merchant_tasksInput, $id: ID!){
      update_merchant_tasks (input: $input id: $id){
        id
        category
        task
        merchant_id
        merchant_name
        assign
        due_date
        description
        task_status
        coupon_details
        is_deleted
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
        "assign": updatedTask.assign,
        "due_date": updatedTask.due_date,
        "description": updatedTask.description,
        "task_status": updatedTask.task_status
      },
      "id": Number(updatedTask.id)
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_ALL_MERCHANT_TASKS", payload: auth_response });
  } catch (error) {
    console.log("error with editMerchantTask request", error);
  }
}

function* deleteMerchantTask(action) {
  try {
    const items = yield axios.delete(
      `/api/tasks/merchants/${action.payload.id}`
    );
    console.log(
      "FETCH request from merchantTask.saga, ITEMS FOR delete = ",
      items
    );
    console.log("merchantTask action.payload = ", action.payload);

    yield put({
      type: "FETCH_ALL_MERCHANT_TASKS",
      payload: action.payload.id,
    });
  } catch (err) {
    console.log("error in deleteMerchantTask Saga", err);
  }
}

export default function* merchantTaskSaga() {
  yield takeEvery("FETCH_MERCHANT_TASKS", merchantTask);
  yield takeEvery("FETCH_ALL_MERCHANT_TASKS", fetchAllMerchantTasks);
  yield takeEvery("ADD_MERCHANT_TASK", addMerchantTask);
  yield takeEvery("UPDATE_MERCHANT_TASK", editMerchantTask);
  yield takeEvery("ARCHIVE_MERCHANT_TASK", deleteMerchantTask);
}
