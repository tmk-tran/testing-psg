import axios from "axios";
import { call, put, takeEvery } from "redux-saga/effects";

function* fetchOrgAdminSaga() {
  try {
    const response = yield axios.get("/api/orgadmin/");
    console.log(
      "FETCH request from userOrgAdmin.saga, response = ",
      response.data
    );
    yield put({ type: "SET_ORG_ADMINS", payload: response.data });
  } catch (error) {
    console.log("error in fetchOrgAdminSaga", error);
  }
}

function* addOrgAdmin(action) {
  console.log(action.payload);
  try {
    const response = yield axios.post(`/api/orgadmin/`, action.payload);
    console.log(
      "ADD request from userOrgAdmin.saga, response FOR ADD = ",
      response
    );
    yield put({
      type: "FETCH_ORG_ADMINS",
    });
  } catch (error) {
    console.log("error with addOrgAdmin request", error);
  }
}

function* updateOrgAdmin(action) {
  console.log(action.payload);
  const userId = action.payload.user_id;
  try {
    const response = yield axios.put(`/api/orgadmin/${userId}`, action.payload);
    console.log(
      "ADD request from userOrgAdmin.saga, response FOR UPDATE = ",
      response
    );
    yield put({
      type: "FETCH_ORG_ADMINS",
    });
  } catch (error) {
    console.log("error with addOrgAdmin request", error);
  }
}

function* removeOrgId(payload) {
  console.log(payload);
  const currentId = payload.currentId;
  const userId = payload.user_id;

  try {
    const response = yield axios.delete(`/api/orgadmin/replace/`, {
      data: {
        user_id: userId,
        org_id: currentId,
      },
    });
    console.log(
      "REPLACE request from userOrgAdmin.saga, response FOR REPLACE = ",
      response.data
    );
    // yield put({
    //   type: "FETCH_ORG_ADMINS",
    // });
  } catch (error) {
    console.log("error with addOrgAdmin request", error);
    throw error; // Rethrow the error to be caught by the calling saga
  }
}

function* replaceOrgId(action) {
  console.log(action.payload);
  const userId = action.payload.user_id;
  const newOrgId = action.payload.org_id;

  try {
    // First, delete the existing org_id
    yield call(removeOrgId, action.payload);

    // Replace with new org_id
    yield put({
      type: "ADD_ORG_ADMIN",
      payload: { user_id: userId, org_id: newOrgId },
    });

    // Fetch org admins
    yield put({ type: "FETCH_ORG_ADMINS" });
  } catch (error) {
    console.log("error with replaceOrgId request", error);
  }
}

function* deleteOrgId(action) {
  console.log(action.payload);
  const userId = action.payload.user_id;
  const orgId = action.payload.org_id;

  try {
    const response = yield axios.delete(`/api/orgadmin/${userId}`, {
      data: { org_id: orgId },
    });
    console.log(
      "DELETE request from userOrgAdmin.saga, response FOR DELETE = ",
      response
    );
    yield put({
      type: "FETCH_ORG_ADMINS",
    });
  } catch (error) {
    console.log("error with addOrgAdmin request", error);
  }
}

export default function* userCouponSaga() {
  yield takeEvery("FETCH_ORG_ADMINS", fetchOrgAdminSaga);
  yield takeEvery("ADD_ORG_ADMIN", addOrgAdmin);
  yield takeEvery("UPDATE_ORG_ADMIN", updateOrgAdmin);
  yield takeEvery("REPLACE_ORG_ID", replaceOrgId);
  yield takeEvery("DELETE_ORG_ID", deleteOrgId);
}
