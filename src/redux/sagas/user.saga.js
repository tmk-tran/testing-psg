import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const response = yield axios.get('/api/user', config);

    yield put({ type: 'SET_USER', payload: response.data });
    console.log(response.data)
    if (response.data.role_id != 20519){
      yield put ({ type: 'DEVII_LOGIN', payload: action.payload})
    } else {
      yield put ({ type: 'ANON_LOGIN' })
    }
   
    // const auth_response = action.payload
    
    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
//     const ACCESS_TOKEN = auth_response.access_token;
// const QUERY_URL = auth_response.routes.query;
// const query = `{
//       user{ 
//     id
//     username
//     password
//     is_admin
//     is_deleted
//   }
// }`;

// const queryConfig = {
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${ACCESS_TOKEN}`,
//   },
// };

// const data = new FormData();
// data.append("query", query);
// data.append("variables", `{}`);

// const response = yield axios.post(QUERY_URL, data, queryConfig);

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
    console.log("From user saga: ", response.data);
    yield put({ type: "SET_USER_TABLE", payload: response.data });
  } catch (error) {
    console.log("User table get request failed", error);
  }
}

function* changeUserRole(action) {
  console.log(action.payload);
  try {
    const response = yield axios.put(
      `/api/user/${action.payload.id}`,
      action.payload
    );
    console.log("From user saga: ", response.data);
    yield put({ type: "FETCH_USER_TABLE" });
  } catch (error) {
    console.log("User table get request failed", error);
  }
}

function* setOrgAdmin(action) {
  console.log(action.payload);
  try {
    const response = yield axios.put(
      `/api/user/org/${action.payload.id}`,
      action.payload
    );
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
}

export default userSaga;
