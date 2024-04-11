import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchAllGroupsSaga(action) {
  try {
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

    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{
          group{
         id
         organization_id
         department
         sub_department
         group_nickname
         group_photo
         group_description
         is_deleted
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

    yield put({ type: "SET_ALL_GROUPS", payload: response.data });
  } catch {
    console.log("error in fetchAllGroupsSaga");
  }
}



export default function* allGroupsSaga() {
  yield takeEvery("FETCH_ALL_GROUPS", fetchAllGroupsSaga);
}