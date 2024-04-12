import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchOrganizationsSaga(action) {
  // function arrayBufferToBase64(buffer) {
  //   let binary = '';
  //   const bytes = new Uint8Array(buffer);
  //   const len = bytes.byteLength;
  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return btoa(binary);
  // }
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
       organization(ordering: "organization_name ASC" filter: "is_deleted = false"){
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
       is_deleted
       organization_earnings
       organization_logo
       filename
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
  } 
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
    console.log(queryConfig);
    console.log("FETCH request fetchOrganizationsSaga", response.data);

    // const organizationLogos = response.data.organization.map(org => {
    //   const organizationLogoBase64 = org.organization_logo ? arrayBufferToBase64(org.organization_logo.data) : null;
    //   return organizationLogoBase64;
    // });

    const payload = {
      organization: response.data.organization,
      aggs: response.data.Aggregates,
      // organization_logo: organizationLogos,
    };
    console.log(payload);
    yield put({ type: "SET_ORGANIZATIONS", payload });
  } catch (error) {
    console.log("error in fetchOrganizationsSaga", error);
  }
}

function* addOrganizationSaga(action) {
  try {
    console.log(action.payload);
    yield axios.post("/api/organizations", action.payload);
    yield put({ type: "FETCH_ORGANIZATIONS" });
  } catch (error) {
    console.log("error in addOrganizationSaga", error);
  }
}

function* deleteOrganizationSaga(action) {
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

    const archivedOrg = action.payload.archivedOrg;
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response);
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
     organization_logo
     filename
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
    data.append(
      "variables",
      JSON.stringify({
        input: {
          organization_name: archivedOrg.name,
          type: archivedOrg.type,
          address: archivedOrg.address,
          city: archivedOrg.city,
          state: archivedOrg.state,
          zip: Number(archivedOrg.zip),
          primary_contact_first_name: archivedOrg.primary_contact_first_name,
          primary_contact_last_name: archivedOrg.primary_contact_last_name,
          primary_contact_phone: Number(archivedOrg.primary_contact_phone),
          primary_contact_email: archivedOrg.primary_contact_email,
          is_deleted: Boolean(archivedOrg.is_deleted),
        },
        id: Number(archivedOrg.id),
      })
    );

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response);
    yield put({ type: "FETCH_ORGANIZATIONS", payload: auth_response });
  } catch (error) {
    console.log("error with deleteOrganizationSaga request", error);
  }
}
function* editOrganizationSaga(action) {
  try {
    console.log("ACTION PAYLOAD IS", action.payload);
    console.log(action.payload);
    const orgId = Number(action.payload.editedAccount.id);
    console.log(orgId);
    console.log(action.payload.editedAccount.organization_earnings);

    // Create a FormData object to send the file data
    const formData = new FormData();
    formData.append("organization_name", action.payload.editedAccount.organization_name);
    formData.append("type", action.payload.editedAccount.type);
    formData.append("address", action.payload.editedAccount.address);
    formData.append("city", action.payload.editedAccount.city);
    formData.append("state", action.payload.editedAccount.state);
    formData.append("zip", action.payload.editedAccount.zip);
    formData.append(
      "primary_contact_first_name",
      action.payload.editedAccount.primary_contact_first_name
    );
    formData.append(
      "primary_contact_last_name",
      action.payload.editedAccount.primary_contact_last_name
    );
    formData.append(
      "primary_contact_phone",
      action.payload.editedAccount.primary_contact_phone
    );
    formData.append(
      "primary_contact_email",
      action.payload.editedAccount.primary_contact_email
    );
    formData.append(
      "organization_earnings",
      action.payload.editedAccount.organization_earnings
    );

    // Check if a file is uploaded
    if (action.payload.uploadedFile) {
      formData.append("organization_logo", action.payload.uploadedFile);
      formData.append("filename", action.payload.uploadedFile.name);
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
