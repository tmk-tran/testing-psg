import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get("/api/user", config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: "SET_USER", payload: response.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* forUserAdmin() {
  try {
    const response = yield axios.get("/api/user/table");
    // console.log("From user saga: ", response.data);
    yield put({ type: "SET_USER_TABLE", payload: response.data });
  } catch (error) {
    console.log("User table get request failed", error);
  }
}

function* changeUserRole(action) {
  try {
    yield axios.put(`/api/user/${action.payload.id}`, action.payload);
    yield put({ type: "FETCH_USER_TABLE" });
  } catch (error) {
    console.log("User table get request failed", error);
  }
}

function* setOrgAdmin(action) {
  try {
    yield axios.put(`/api/user/org/${action.payload.id}`, action.payload);
    yield put({ type: "FETCH_USER_TABLE" });
  } catch (error) {
    console.log("User table get request failed", error);
  }
}

function* editUserName(action) {
  try {
    yield axios.put(`/api/user/name/${action.payload.id}`, action.payload);
    yield put({ type: "FETCH_USER_TABLE" });
  } catch (error) {
    console.log("User table get request failed", error);
  }
}

function* deleteUser(action) {
  try {
    yield axios.delete(`/api/user/${action.payload.id}`);
    yield put({ type: "FETCH_USER_TABLE" });
  } catch (error) {
    console.log("User table get request failed", error);
  }
}

function* editUserName(action) {
  console.log(action.payload);
  try {
    const response = yield axios.put(
      `/api/user/name/${action.payload.id}`,
      action.payload
    );
    console.log("From user saga: ", response.data);
    yield put({ type: "FETCH_USER_TABLE" });
  } catch (error) {
    console.log("User table get request failed", error);
  }
}

function* deleteUser(action) {
  console.log(action.payload);
  try {
    const response = yield axios.delete(`/api/user/${action.payload.id}`);
    console.log("From user saga: ", response.data);
    yield put({ type: "FETCH_USER_TABLE" });
  } catch (error) {
    console.log("User table get request failed", error);
  }
}

function* userSaga() {
  yield takeLatest("FETCH_USER", fetchUser);
  yield takeLatest("FETCH_USER_TABLE", forUserAdmin);
  yield takeLatest("CHANGE_USER_ROLE", changeUserRole);
  yield takeLatest("SET_ORGANIZATION_ADMIN", setOrgAdmin);
  yield takeLatest("EDIT_USER_NAME", editUserName);
  yield takeLatest("DELETE_USER", deleteUser);
}

export default userSaga;
