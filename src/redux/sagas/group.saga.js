//Imports for use in groups saga
import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";
//Fetches group details based in id number
function* fetchGroupSaga(action) {
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
              group (filter: "id = ${action.payload.id}"){
             id
             organization_id
             department
             sub_department
             group_nickname
             group_photo
             group_description
             is_deleted
             fundraiser_collection{
             id
             group_id
             title
             description
              requested_book_quantity
             book_quantity_checked_out
             book_checked_out_total_value
             book_quantity_checked_in
             books_sold
             money_received
             start_date
             end_date
             coupon_book_id
             outstanding_balance
             is_deleted
             closed
             goal
        }
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
        yield put({ type: "SET_GROUP_DETAILS", payload: response.data.group })
    } catch (err) {
        console.log("Error fetching group details", err)
    }
}
//Fetches organization groups based on group id
function* fetchOrgGroupsSaga(action) {
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
        const query = `{ group (filter: "organization_id = ${action.payload.id}"){
             id
             organization_id
             department
             sub_department
             group_nickname
             group_photo
             group_description
             is_deleted
             fundraiser_collection{
             id
             group_id
             title
             description
              requested_book_quantity
             book_quantity_checked_out
             book_checked_out_total_value
             book_quantity_checked_in
             books_sold
             money_received
             start_date
             end_date
             coupon_book_id
             outstanding_balance
             is_deleted
             closed
             goal
        }
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
        yield put({ type: "SET_ORG_GROUPS", payload: response.data.group })
        console.log("response data = ", response.data);
    } catch (err) {
        console.log("Error fetching organization groups", err)
    }
}
//Saga used to add a new group to an organization, will then fetch the organization details
function* addGroupSaga(action) {
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
        const newGroup = action.payload.newGroup
        const ACCESS_TOKEN = auth_response.data.access_token;
        const QUERY_URL = auth_response.data.routes.query;
        const query = ` mutation ($input: groupInput){
              create_group(input: $input){
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
        data.append("variables", JSON.stringify({
            "input": {
                "organization_id": Number(newGroup.organization_id),
                "department": newGroup.department,
                "sub_department": newGroup.sub_department,
                "group_nickname": newGroup.group_nickname,
                "group_description": newGroup.group_description
            }
        }));

        const response = yield axios.post(QUERY_URL, data, queryConfig);
        console.log(response)
        yield put({ type: "FETCH_ORG_GROUPS", payload: { id: Number(newGroup.organization_id), auth: auth_response } })
        console.log("org id in saga  = ", Number(newGroup.organization_id));
    } catch (err) {
        console.log("Error adding a new group", err)
    }
}
//Saga used to update group details
// function* updateGroupSaga(action) {
//     try {
//         console.log(action.payload)
//         yield axios.post(`/api/group/${action.payload}`, action.payload)
//         yield put({ type: "FETCH_GROUP_DETAILS", payload: action.payload.organization_id })
//     } catch (err) {
//         console.log("Error updating group details", err)
//     }
// }



//Watcher saga that exports all sagas for use in root saga
export default function* groupSaga() {
    yield takeEvery("FETCH_GROUP_DETAILS", fetchGroupSaga)
    yield takeEvery("FETCH_ORG_GROUPS", fetchOrgGroupsSaga)
    yield takeEvery("ADD_GROUP", addGroupSaga)
    // yield takeEvery("UPDATE_GROUP", updateGroupSaga)
}