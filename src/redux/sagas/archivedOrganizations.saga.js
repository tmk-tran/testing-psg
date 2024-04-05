import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchArchivedOrganizationsSaga(action) {
  try {
    const auth_response = action.payload
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{
       organization(ordering: "group_collection.organization_id" filter: "is_deleted = true"){
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
       organization_notes_collection {
       organization_id
       note_date
       note_content
       is_deleted
    }
     group_collection {
       organization_id
       department
       sub_department
       group_nickname
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
  } Aggregates {
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
    console.log("FETCH request fetchOrganizationsSaga");
    yield put({ type: "SET_ARCHIVED_ORGANIZATIONS", payload: response.data.organization });
  } catch (error) {
    console.log("error in fetchArchivedOrganizationsSaga", error);
  }
}


function* resetOrganizationSaga(action) {
  try {
    console.log(action.payload)
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
        "organization_earnings": Number(resetOrg.organization_earnings),
        "is_deleted": Boolean(resetOrg.is_deleted)
      },
      "id": Number(resetOrg.id)
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_ORGANIZATIONS", payload: auth_response });
    yield put({ type: "FETCH_ARCHIVED_ORGANIZATIONS", payload: auth_response });
  } catch (error) {
    console.log("error with resetOrganizationSaga request", error);
  }
}


export default function* archivedOrganizationsSaga() {
  yield takeEvery("FETCH_ARCHIVED_ORGANIZATIONS", fetchArchivedOrganizationsSaga);

  yield takeEvery("RESET_ORGANIZATION", resetOrganizationSaga);
}