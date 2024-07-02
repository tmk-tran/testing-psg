import axios from "axios";
import { call, put, takeEvery } from "redux-saga/effects";

function* fetchOrgAdminSaga() {
  try {
    const response = yield axios.get("/api/orgadmin/");
    // console.log(
    //   "FETCH request from userOrgAdmin.saga, response = ",
    //   response.data
    // );
    yield put({ type: "SET_ORG_ADMINS", payload: response.data });
  } catch (error) {
    console.log("error in fetchOrgAdminSaga", error);
  }
}

function* addOrgAdmin(action) {
  try {
    yield axios.post(`/api/orgadmin/`, action.payload);
    yield put({
      type: "FETCH_ORG_ADMINS",
    });
  } catch (error) {
    console.log("error with addOrgAdmin request", error);
  }
}

function* updateOrgAdmin(action) {
  const userId = action.payload.user_id;
  try {
    yield axios.put(`/api/orgadmin/${userId}`, action.payload);
    yield put({
      type: "FETCH_ORG_ADMINS",
    });
  } catch (error) {
    console.log("error with addOrgAdmin request", error);
  }
}

function* removeOrgId(payload) {
  const currentId = payload.currentId;
  const userId = payload.user_id;

  try {
    yield axios.delete(`/api/orgadmin/replace/`, {
      data: {
        user_id: userId,
        org_id: currentId,
      },
    });
  } catch (error) {
    console.log("error with addOrgAdmin request", error);
    throw error; // Rethrow the error to be caught by the calling saga
  }
}

function* replaceOrgId(action) {
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
  const userId = action.payload.user_id;
  const orgId = action.payload.org_id;

  try {
    yield axios.delete(`/api/orgadmin/${userId}`, {
      data: { org_id: orgId },
    });
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
