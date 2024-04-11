import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* orgDetails(action) {
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
    console.log(auth_response)
    console.log(action.payload)
    const query = `{
     organization (filter: "id =${action.payload.id} "){
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
      organization_notes_collection{
      organization_id
      note_date
      note_content
      is_deleted
    }
    group_collection{
     organization_id
     department
     sub_department
     group_nickname
     group_description
     is_deleted
     fundraiser_collection{
      goal
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
    yield put({ type: "SET_ORG_DETAILS", payload: response.data.organization });
  } catch (error) {
    console.log("error in orgDetailsSaga", error);
  }
}


function* editOrg(action) {
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

    const editedOrg = action.payload.editedItem
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    console.log(auth_response)
    console.log(action.payload)
    const query = `mutation ($input: organizationInput, $id: ID!) {
    update_organization(input: $input, id: $id) {
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
        fundraiser_collection {
          goal
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
    data.append("variables", JSON.stringify({
      "input": {
        "organization_name": editedOrg.organization_name,
        "type": editedOrg.type,
        "address": editedOrg.type,
        "city": editedOrg.city,
        "state": editedOrg.state,
        "zip": Number(editedOrg.zip),
        "primary_contact_first_name": editedOrg.primary_contact_first_name,
        "primary_contact_last_name": editedOrg.primary_contact_last_name,
        "primary_contact_phone": Number(editedOrg.primary_contact_phone),
        "primary_contact_email": editedOrg.primary_contact_email
      },
      "id": Number(editedOrg.id)
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)

    yield put({ type: "FETCH_ORG_DETAILS", payload: { id: editedOrg.id, auth: auth_response } });
  } catch {
    console.log("error in editOrgSaga");
  }
}

export default function* orgDetailsSaga() {
  yield takeEvery("FETCH_ORG_DETAILS", orgDetails);
  yield takeEvery("EDIT_ORG_DETAILS", editOrg);
}
