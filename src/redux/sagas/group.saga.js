//Imports for use in groups saga
import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";
//Fetches group details based in id number
function* fetchGroupSaga(action) {
    try {
        console.log(action.payload)
        const auth_response = action.payload.auth
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
        console.log(action.payload)
        const auth_response = action.payload.auth
        const ACCESS_TOKEN = auth_response.data.access_token;
        const QUERY_URL = auth_response.data.routes.query;
        const query = `{\r\n  group (filter: "organization_id = ${action.payload.id}"){\r\n id\r\n organization_id\r\n department\r\n sub_department\r\n group_nickname\r\n group_photo\r\n group_description\r\n is_deleted\r\n fundraiser_collection{\r\n id\r\n group_id\r\n title\r\n description\r\n  requested_book_quantity\r\n book_quantity_checked_out\r\n book_checked_out_total_value\r\n book_quantity_checked_in\r\n books_sold\r\n money_received\r\n start_date\r\n end_date\r\n coupon_book_id\r\n outstanding_balance\r\n is_deleted\r\n closed\r\n goal\r\n}\r\n}\r\n}`;



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
        yield put({ type: "SET_ORG_GROUPS", payload: response.data.group })
        console.log("response data = ", response.data);
    } catch (err) {
        console.log("Error fetching organization groups", err)
    }
}
//Saga used to add a new group to an organization, will then fetch the organization details
function* addGroupSaga(action) {
    try {
        console.log(action.payload)
        const newGroup = action.payload.newGroup
        const auth_response = action.payload.auth
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
function* updateGroupSaga(action) {
    try {
        console.log(action.payload)
        yield axios.post(`/api/group/${action.payload}`, action.payload)
        yield put({ type: "FETCH_GROUP_DETAILS", payload: action.payload.organization_id })
    } catch (err) {
        console.log("Error updating group details", err)
    }
}



//Watcher saga that exports all sagas for use in root saga
export default function* groupSaga() {
    yield takeEvery("FETCH_GROUP_DETAILS", fetchGroupSaga)
    yield takeEvery("FETCH_ORG_GROUPS", fetchOrgGroupsSaga)
    yield takeEvery("ADD_GROUP", addGroupSaga)
    yield takeEvery("UPDATE_GROUP", updateGroupSaga)
}