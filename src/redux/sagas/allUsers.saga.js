import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchAllUsers(action) {
    try {
        const auth_response = action.payload
        const ACCESS_TOKEN = auth_response.data.access_token;
        const QUERY_URL = auth_response.data.routes.query;
        console.log(auth_response)
        const query = `{
                users{ 
             id
             username
             password
             is_admin
             is_deleted
             role_id
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
        console.log(response)
        console.log("FETCH request fetchAllUsers");
        yield put({ type: "SET_ALL_USERS", payload: response.data.users });
    } catch (err) {
        console.log("error in fetching coupon books", err);
    }
}

function* editAdminStatus(action) {
    try {
        const response = yield axios.put("api/allUsers", action.payload);
        console.log("EDIT ADMIN STATUS");
        yield put({ type: "FETCH_ALL_USERS" });
    } catch (err) {
        console.log("error in editing admin status", err);
    }

}

export default function* allUsersSaga() {
    yield takeEvery("FETCH_ALL_USERS", fetchAllUsers);
    yield takeEvery("EDIT_ADMIN_STATUS", editAdminStatus);

}