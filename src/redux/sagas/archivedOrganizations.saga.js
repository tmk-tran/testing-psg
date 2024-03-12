import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchArchivedOrganizationsSaga(action) {
  try {
    const auth_response = action.payload
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response)
    const query = `{\r\n organization(ordering: "group_collection.organization_id" filter: "is_deleted = true"){\r\n id\r\n organization_name\r\n type\r\n address\r\n city\r\n state\r\n zip\r\n primary_contact_first_name\r\n primary_contact_last_name\r\n primary_contact_phone\r\n primary_contact_email\r\n organization_logo\r\n is_deleted\r\n organization_earnings\r\n organization_notes_collection {\r\n organization_id\r\n note_date\r\n note_content\r\n is_deleted\r\n}\r\n group_collection {\r\n organization_id\r\n department\r\n sub_department\r\n group_nickname\r\n group_description\r\n is_deleted\r\n fundraiser_collection{\r\n id\r\n group_id\r\n title\r\n description\r\n requested_book_quantity\r\n book_quantity_checked_out\r\n book_checked_out_total_value\r\n book_quantity_checked_in\r\n books_sold\r\n money_received\r\n start_date\r\n end_date\r\n coupon_book_id\r\n outstanding_balance\r\n is_deleted\r\n closed\r\n goal\r\n}\r\n}\r\n} Aggregates {
      total_books_sold: sum(
        subquery: "query{fundraiser{books_sold group{organization_id}}}"
        ordering: "group_organization_id ASC"
      )
      total_groups: count(subquery: "query{group{id organization_id}}"
        ordering: "group_organization_id ASC"
      )
      total_fundraisers: count(subquery: "query{fundraiser{id group{organization_id}}}" 
        ordering: "group_organization_id ASC"
      )
      total_open_fundraisers: count(subquery:"query{fundraiser{id group{organization_id}}}"
        filter: "closed=false" 
        ordering: "group_organization_id ASC"
      )
      total_closed_fundraisers: count(subquery:"query{fundraiser{id group{organization_id}}}"
        filter: "closed=true" 
        ordering: "group_organization_id ASC"
      )
      total_outstanding_balance: sum
      (subquery: "query{fundraiser {outstanding_balance group{organization_id}}}" 
        ordering: "group_organization_id ASC"
      )
      total_books_checked_out: sum(subquery: "query{fundraiser {book_quantity_checked_out group{organization_id}}}" 
        filter: "closed=false" 
        ordering: "group_organization_id ASC"
      )
      total_books_checked_in: sum(
        subquery: "query{fundraiser {book_quantity_checked_in group{organization_id}}}" 
        filter: "closed=false" 
        ordering: "group_organization_id ASC")
    }\r\n}`;

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
    console.log("FETCH request fetchOrganizationsSaga");
    yield put({ type: "SET_ARCHIVED_ORGANIZATIONS", payload: response.data.organization });
  } catch (error) {
    console.log("error in fetchArchivedOrganizationsSaga", error);
  }
}


function* resetOrganizationSaga(action) {
  try {
    const resetOrg = action.payload.resetOrg
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response)
    const query = `
     mutation ($input: organizationInput, $id: ID!){
     update_organization(input: $input id: $id)
   {
     id
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
        "organization_name": resetOrg.organization_name,
        "type": resetOrg.type,
        "address": resetOrg.address,
        "city": resetOrg.city,
        "state": resetOrg.state,
        "zip": Number(resetOrg.zip),
        "primary_contact_first_name": resetOrg.primary_contact_first_name,
        "primary_contact_last_name": resetOrg.primary_contact_last_name,
        "primary_contact_phone": resetOrg.primary_contact_phone,
        "primary_contact_email": resetOrg.primary_contact_email,
        "organization_logo": resetOrg.organization_logo,
        "organization_earnings": Number(resetOrg.organization_earnings),
        "is_deleted": resetOrg.is_deleted
      },
      "id": Number(resetOrg.id)
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_ORGANIZATIONS", payload: auth_response });
    yield put({ type: "FETCH_ARCHIVED_ORGANIZATIONS", payload: auth_response });
  } catch (error) {
    console.log("error with deleteOrganizationSaga request", error);
  }
}


export default function* archivedOrganizationsSaga() {
  yield takeEvery("FETCH_ARCHIVED_ORGANIZATIONS", fetchArchivedOrganizationsSaga);

  yield takeEvery("RESET_ORGANIZATION", resetOrganizationSaga);
}