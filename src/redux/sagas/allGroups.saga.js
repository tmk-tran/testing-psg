import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchAllGroupsSaga(action) {
    try {
      const auth_response = action.payload
      const ACCESS_TOKEN = auth_response.data.access_token;
      const QUERY_URL = auth_response.data.routes.query;
      const query = "{\r\n  group{\r\n id\r\n organization_id\r\n department\r\n sub_department\r\n group_nickname\r\n group_photo\r\n group_description\r\n is_deleted\r\n }\r\n}";

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