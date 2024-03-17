//Imports used for this saga
import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

//Fetches fundraiser data based on the group id
function* fetchFundraisersSaga(action) {
    try {
        console.log(action.payload.auth)
        const auth_response = action.payload.auth
        const ACCESS_TOKEN = auth_response.data.access_token;
        const QUERY_URL = auth_response.data.routes.query;
        const query = `{
               fundraiser (filter: "group_id = ${action.payload.id}"){
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
             group {
             organization_id
             department
             sub_department
             group_nickname
             group_photo
             group_description
             is_deleted
             organization{
             organization_name
             type
             address
             city
             state
             zip
             primary_contact_first_name
             primary_contact_last_name
             primary_contact_phone
             primary_contact_email
             organization_logo
             is_deleted
             organization_earnings
        }
    }coupon_book {
             id
             year
        }
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
        yield put({ type: "SET_FUNDRAISERS", payload: response.data.fundraiser })
        console.log(response.data);
    } catch (err) {
        console.log("Error fetching fundraisers ", err)
    }
}

// Fetches fundraiser data based on organization id
function* fetchOrgFundraisersSaga(action) {
    try {
        const auth_response = action.payload.auth
        const orgId = action.payload.id
        const ACCESS_TOKEN = auth_response.data.access_token;
        const QUERY_URL = auth_response.data.routes.query;
        console.log(auth_response)
        console.log(action.payload)
        const query = `{
              fundraiser (filter: "group.organization_id = ${orgId}"){
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
            group {
            organization_id
            department
            sub_department
            group_nickname
            group_photo
            group_description
            is_deleted
            organization{
            organization_name
            type
            address
            city
            state
            zip
            primary_contact_first_name
            primary_contact_last_name
            primary_contact_phone
            primary_contact_email
            is_deleted
            organization_earnings
        }
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
        yield put({ type: "SET_ORG_FUNDRAISERS", payload: response.data.fundraiser })
    } catch (err) {
        console.log("Error fetching ORG fundraisers ", err)
    }
}

//Saga used to add a fundraiser, will then fetch the updated list of fundraisers
function* addFundraiserSaga(action) {
    try {
        const newFundraiser = action.payload.newFundraiser
        const auth_response = action.payload.auth
        const ACCESS_TOKEN = auth_response.data.access_token;
        const QUERY_URL = auth_response.data.routes.query;

        const query = `mutation($input: fundraiserInput!) {
            create_fundraiser(input: $input){
                id 
                group_id
                title
                description
                photo
                requested_book_quantity
                book_quantity_checked_out
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
                "group_id": Number(newFundraiser.group_id),
                "title": newFundraiser.title,
                "description": newFundraiser.description,
                "requested_book_quantity": Number(newFundraiser.requested_book_quantity),
                "book_quantity_checked_out": Number(newFundraiser.book_quantity_checked_out),
                "book_quantity_checked_in": Number(newFundraiser.book_quantity_checked_in),
                "books_sold": Number(newFundraiser.books_sold),
                "money_received": Number(newFundraiser.money_received),
                "start_date": newFundraiser.start_date,
                "end_date": newFundraiser.end_date,
                "coupon_book_id": Number(newFundraiser.coupon_book_id),
                "goal": Number(newFundraiser.goal)
            }
        }));

        console.log(data);

        yield axios.post(QUERY_URL, data, queryConfig);
        yield put({
            type: "FETCH_FUNDRAISERS", payload:
                { id: Number(newFundraiser.group_id), auth: auth_response }
        });
    } catch (error) {
        console.log("Unable to add fundraiser", error);
    }
}

//Saga used to update the amounts in a fundraiser, will then fetch the updated fundraiser data
function* updatedFundraiserAmountsSaga(action) {
    try {
        console.log(action.payload)
        const updatedFundraiser = action.payload.updatedAmount
        console.log(updatedFundraiser)
        const auth_response = action.payload.auth
        const ACCESS_TOKEN = auth_response.data.access_token;
        const QUERY_URL = auth_response.data.routes.query;
        const query = ` mutation ($input: fundraiserInput , $id: ID!){
             update_fundraiser(input:$input id: $id)
             {
             id
             group_id
             title
             description
             photo
             requested_book_quantity
             book_quantity_checked_out
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
    }`

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
                "group_id": Number(updatedFundraiser.group_id),
                "title": updatedFundraiser.title,
                "description": updatedFundraiser.description,
                "requested_book_quantity": Number(updatedFundraiser.requested_book_quantity),
                "book_quantity_checked_out": Number(updatedFundraiser.newBooksCheckedOut),
                "book_quantity_checked_in": Number(updatedFundraiser.newBooksCheckedIn),
                "books_sold": Number(updatedFundraiser.newBooksSold),
                "money_received": Number(updatedFundraiser.newMoneyReceived),
                "start_date": updatedFundraiser.start_date,
                "end_date": updatedFundraiser.end_date,
                "coupon_book_id": Number(updatedFundraiser.coupon_book_id),
                "goal": Number(updatedFundraiser.newGoal)
            },
            "id": updatedFundraiser.id
        }));
        console.log(data)

        yield axios.post(QUERY_URL, data, queryConfig);
        yield put({ type: "FETCH_FUNDRAISERS", payload: { id: Number(updatedFundraiser.group_id), auth: auth_response } })
    } catch (err) {
        console.log("Unable to update amounts for fundraisers", err)
    }
}
//Saga used to update a fundraiser to closed, will then fetch updated fundraisers data
function* closeFundraiserSaga(action) {
    try {
        console.log(action.payload)
        const closedFundraiser = action.payload.closedFundraiser
        const auth_response = action.payload.auth
        const ACCESS_TOKEN = auth_response.data.access_token;
        const QUERY_URL = auth_response.data.routes.query;
        const query = ` mutation ($input: fundraiserInput , $id: ID!){
            update_fundraiser(input:$input
            id: $id){
            id
            group_id
            title
            description
            photo
            requested_book_quantity
            book_quantity_checked_out
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
   }`

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
                "group_id": Number(closedFundraiser.group_id),
                "title": closedFundraiser.title,
                "description": closedFundraiser.description,
                "requested_book_quantity": Number(closedFundraiser.requested_book_quantity),
                "book_quantity_checked_out": Number(closedFundraiser.book_quantity_checked_out),
                "book_quantity_checked_in": Number(closedFundraiser.book_quantity_checked_in),
                "books_sold": Number(closedFundraiser.books_sold),
                "money_received": Number(closedFundraiser.money_received),
                "start_date": closedFundraiser.start_date,
                "end_date": closedFundraiser.end_date,
                "coupon_book_id": Number(closedFundraiser.coupon_book_id),
                "goal": Number(closedFundraiser.goal),
                "closed": Boolean(closedFundraiser.closed)
            },
            "id": closedFundraiser.id
        }));
        console.log(data)

        yield axios.post(QUERY_URL, data, queryConfig);
        yield put({ type: "FETCH_FUNDRAISERS", payload: { id: Number(closedFundraiser.group_id), auth: auth_response } })
    } catch (err) {
        console.log("Error setting fundraiser to closed", err)
    }
}
//Saga used to update a fundraiser to open, will then fetch updated fundraisers data
function* openFundraiserSaga(action) {
    try {

        console.log(action.payload)
        const openedFundraiser = action.payload.openedFundraiser
        const auth_response = action.payload.auth
        const ACCESS_TOKEN = auth_response.data.access_token;
        const QUERY_URL = auth_response.data.routes.query;
        const query = `mutation($input: fundraiserInput, $id: ID!){
            update_fundraiser(input:$input
            id: $id){
            id
            group_id
            title
            description
            photo
            requested_book_quantity
            book_quantity_checked_out
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
        }`

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
                "group_id": Number(openedFundraiser.group_id),
                "title": openedFundraiser.title,
                "description": openedFundraiser.description,
                "requested_book_quantity": Number(openedFundraiser.requested_book_quantity),
                "book_quantity_checked_out": Number(openedFundraiser.book_quantity_checked_out),
                "book_quantity_checked_in": Number(openedFundraiser.book_quantity_checked_in),
                "books_sold": Number(openedFundraiser.books_sold),
                "money_received": Number(openedFundraiser.money_received),
                "start_date": openedFundraiser.start_date,
                "end_date": openedFundraiser.end_date,
                "coupon_book_id": Number(openedFundraiser.coupon_book_id),
                "goal": Number(openedFundraiser.goal),
                "closed": Boolean(openedFundraiser.closed)
            },
            "id": Number(openedFundraiser.id)
        }));

        yield axios.post(QUERY_URL, data, queryConfig);
        yield put({ type: "FETCH_FUNDRAISERS", payload: { id: Number(openedFundraiser.group_id), auth: auth_response } })
    } catch (err) {
        console.log("Error setting fundraiser to closed", err)
    }
}

//Watcher saga that exports all sagas to for use in the root saga
export default function* fundraiserSaga() {
    yield takeEvery("FETCH_FUNDRAISERS", fetchFundraisersSaga);
    yield takeEvery("FETCH_ORG_FUNDRAISERS", fetchOrgFundraisersSaga);
    yield takeEvery("ADD_FUNDRAISER", addFundraiserSaga);
    yield takeEvery("CLOSE_FUNDRAISER", closeFundraiserSaga);
    yield takeEvery("OPEN_FUNDRAISER", openFundraiserSaga);
    yield takeEvery("UPDATE_FUNDRAISER_AMOUNTS", updatedFundraiserAmountsSaga);
}