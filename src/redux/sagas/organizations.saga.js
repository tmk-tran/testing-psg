import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchOrganizationsSaga(action) {
  try {
    const auth_response = action.payload
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response)
    const query = `{\r\n organization(ordering: "group_collection.organization_id"){\r\n id\r\n organization_name\r\n type\r\n address\r\n city\r\n state\r\n zip\r\n primary_contact_first_name\r\n primary_contact_last_name\r\n primary_contact_phone\r\n primary_contact_email\r\n organization_logo\r\n is_deleted\r\n organization_earnings\r\n organization_notes_collection {\r\n organization_id\r\n note_date\r\n note_content\r\n is_deleted\r\n}\r\n group_collection {\r\n organization_id\r\n department\r\n sub_department\r\n group_nickname\r\n group_description\r\n is_deleted\r\n fundraiser_collection{\r\n id\r\n group_id\r\n title\r\n description\r\n requested_book_quantity\r\n book_quantity_checked_out\r\n book_checked_out_total_value\r\n book_quantity_checked_in\r\n books_sold\r\n money_received\r\n start_date\r\n end_date\r\n coupon_book_id\r\n outstanding_balance\r\n is_deleted\r\n closed\r\n goal\r\n}\r\n}\r\n} 
    Aggregates {
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

    yield put({ type: "SET_ORGANIZATIONS", payload: { organization: response.data.organization, aggs: response.data.Aggregates } });
  } catch (error) {
    console.log("error in fetchOrganizationsSaga", error);
  }
}

function* addOrganizationSaga(action) {
  try {
    const newOrg = action.payload.newOrg
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response)
    const query = ` mutation ($input: organizationInput){create_organization(input: $input){
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
        "organization_name": newOrg.organization_name,
        "type": newOrg.type,
        "address": newOrg.type,
        "city": newOrg.city,
        "state": newOrg.state,
        "zip": Number(newOrg.zip),
        "primary_contact_first_name": newOrg.primary_contact_first_name,
        "primary_contact_last_name": newOrg.primary_contact_last_name,
        "primary_contact_phone": Number(newOrg.primary_contact_phone),
        "primary_contact_email": newOrg.primary_contact_email,
        "organization_logo": newOrg.organization_logo,
        "organization_earnings": Number(newOrg.organization_earnings)
      },
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_ORGANIZATIONS", payload: auth_response });
  } catch (error) {
    console.log("error in addOrganizationSaga", error);
  }
}

function* deleteOrganizationSaga(action) {
  try {
    const archivedOrg = action.payload.archivedOrg
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response)
    const query = `mutation ($input: organizationInput, $id: ID!){
     update_organization(input: $input, id: $id)
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
        "organization_name": archivedOrg.organization_name,
        "type": archivedOrg.type,
        "address": archivedOrg.type,
        "city": archivedOrg.city,
        "state": archivedOrg.state,
        "zip": Number(archivedOrg.zip),
        "primary_contact_first_name": archivedOrg.primary_contact_first_name,
        "primary_contact_last_name": archivedOrg.primary_contact_last_name,
        "primary_contact_phone": Number(archivedOrg.primary_contact_phone),
        "primary_contact_email": archivedOrg.primary_contact_email,
        "is_deleted": Boolean(archivedOrg.is_deleted)
      },
      "id": Number(archivedOrg.id)
    }));;

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_ORGANIZATIONS", payload: auth_response });
  } catch (error) {
    console.log("error with deleteOrganizationSaga request", error);
  }
}
function* editOrganizationSaga(action) {
  try {
    console.log("ACTION PAYLOAD IS", action.payload);
    console.log(action.payload);
    const orgId = action.payload.id;
    console.log(orgId);

    // Create a FormData object to send the file data
    const formData = new FormData();
    formData.append(
      "organization_name",
      action.payload.organization_name
    );
    formData.append("type", action.payload.type);
    formData.append("address", action.payload.address);
    formData.append("city", action.payload.city);
    formData.append("state", action.payload.state);
    formData.append("zip", action.payload.zip);
    formData.append(
      "primary_contact_first_name",
      action.payload.primary_contact_first_name
    );
    formData.append(
      "primary_contact_last_name",
      action.payload.primary_contact_last_name
    );
    formData.append(
      "primary_contact_phone",
      action.payload.primary_contact_phone
    );
    formData.append(
      "primary_contact_email",
      action.payload.primary_contact_email
    );
    formData.append(
      "organization_earnings",
      action.payload.organization_earnings
    );

    // Check if a file is uploaded
    if (action.payload.uploadedFile) {
      formData.append(
        "organization_logo",
        action.payload.uploadedFile
      );
      formData.append(
        "filename",
        action.payload.uploadedFile.name
      );
    }

    const response = yield axios.put(`/api/organizations/${orgId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
      },
    });

    console.log("RESPONSE IS", response);

    yield put({ type: "FETCH_ORGANIZATIONS", payload: action.payload });
  } catch (error) {
    console.log("error in edit invoice", error);
  }
}

export default function* organizationsSaga() {
  yield takeEvery("FETCH_ORGANIZATIONS", fetchOrganizationsSaga);
  yield takeEvery("ADD_ORGANIZATION", addOrganizationSaga);
  yield takeEvery("DELETE_ORGANIZATION", deleteOrganizationSaga);
  yield takeEvery("EDIT_ORGANIZATION", editOrganizationSaga);
}
