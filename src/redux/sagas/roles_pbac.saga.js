import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchRoles(action) {
  const refreshToken = localStorage.psg_token;
  console.log(refreshToken)
  // Login to Devii
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${refreshToken}`,
    },
  };

  const AUTH_URL = "https://api.devii.io/auth";

  const auth_response = yield axios.get(AUTH_URL, config);
  console.log(auth_response)

  const ACCESS_TOKEN = auth_response.access_token;
  const ROLES_PBAC = auth_response.routes.roles_pbac;
  const query = `{
    role {
      roleid
      name
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

  const result = yield axios.post(ROLES_PBAC, data, queryConfig);
  console.log(result)

  yield put({ type: "SET_ROLES", payload: result.data })
}

export default function* rolesSaga() {
  yield takeEvery("FETCH_ROLES", fetchRoles);
}