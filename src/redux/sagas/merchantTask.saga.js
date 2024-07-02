import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* merchantTask(action) {
  try {
    const items = yield axios.get(`/api/merchantTask/${action.payload}`);
    // console.log("FETCH request from merchantTask.saga, ITEMS = ", items.data);
    yield put({ type: "SET_MERCHANT_TASKS", payload: items.data });
  } catch (error) {
    console.log("error in merchantTasks Saga", error);
  }
}

function* fetchAllMerchantTasks() {
  try {
    const items = yield axios.get("/api/tasks/merchants");
    // console.log("FETCH all merchant tasks, ITEMS = ", items.data);
    yield put({ type: "SET_MERCHANT_TASKS", payload: items.data });
  } catch (error) {
    console.log("error in fetchAllMerchantTasks Saga", error);
  }
}

function* addMerchantTask(action) {
  try {
    yield axios.post("/api/tasks/merchants", action.payload);

    const fetchType =
      action.payload.fetchType === "FETCH_MERCHANT_TASKS"
        ? "FETCH_MERCHANT_TASKS"
        : "FETCH_ALL_MERCHANT_TASKS";

    yield put({
      type: fetchType,
      payload: action.payload.merchant_id,
    });
  } catch (err) {
    console.log("error in addMerchantTask Saga", err);
  }
}

function* editMerchantTask(action) {
  try {
    yield axios.put(
      `/api/tasks/merchants/${action.payload.id}`,
      action.payload
    );
    yield put({
      type: "FETCH_MERCHANT_TASKS",
      payload: action.payload.merchantId,
    });
  } catch (err) {
    console.log("error in editMerchantTask Saga", err);
  }
}

function* changeTaskStatus(action) {
  try {
    yield axios.put(
      `/api/tasks/merchants/status/${action.payload.id}`,
      action.payload
    );
    yield put({
      type: "FETCH_ALL_MERCHANT_TASKS",
    });
  } catch (err) {
    console.log("error in changeTaskStatus Saga", err);
  }
}

function* changeAssignedTo(action) {
  const taskId = action.payload.id;
  const merchantId = action.payload.merchantId;

  try {
    yield axios.put(`/api/merchantTask/${taskId}`, action.payload);
    yield put({
      type: "FETCH_ALL_MERCHANT_TASKS",
      payload: merchantId,
    });
  } catch (err) {
    console.log("error in editMerchantTask Saga", err);
  }
}

function* changeDueDate(action) {
  const taskId = action.payload.id;
  const merchantId = action.payload.merchantId;

  try {
    yield axios.put(`/api/merchantTask/duedate/${taskId}`, action.payload);
    yield put({
      type: "FETCH_ALL_MERCHANT_TASKS",
      payload: merchantId,
    });
  } catch (err) {
    console.log("error in editMerchantTask dueDate Saga", err);
  }
}

function* deleteMerchantTask(action) {
  try {
    const items = yield axios.delete(
      `/api/tasks/merchants/${action.payload.id}`
    );
    // console.log(
    //   "FETCH request from merchantTask.saga, ITEMS FOR delete = ",
    //   items
    // );
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
  yield takeEvery("CHANGE_ASSIGNED_TO", changeAssignedTo);
  yield takeEvery("CHANGE_DUE_DATE", changeDueDate);
  yield takeEvery("ARCHIVE_MERCHANT_TASK", deleteMerchantTask);
}
