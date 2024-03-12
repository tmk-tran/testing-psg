import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchRoles(action){
    const auth_response = action.payload
    const ACCESS_TOKEN = auth_response.access_token;
const ROLES_PBAC = auth_response.routes.roles_pbac;
const query = "{\r\n  role {\r\n    roleid\r\n    name\r\n  }\r\n}";

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

yield put ({type: "SET_ROLES", payload: result.data})
}

export default function* rolesSaga(){
    yield takeEvery("FETCH_ROLES", fetchRoles);
}