import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* fetchOrganizationsSaga() {
  try {
    const response = yield axios.get("/api/organizations");
    console.log("FETCH request fetchOrganizationsSaga successful");
    yield put({ type: "SET_ORGANIZATIONS", payload: response.data });
  } catch {
    console.log("error in fetchOrganizationsSaga");
  }
}

function* addOrganizationSaga(action) {
  try {
    // console.log(action.payload);
    // Create a FormData object to send the file data
    const formData = new FormData();
    formData.append("organization_name", action.payload.organization_name);
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
    formData.append("organization_logo", action.payload.organization_logo);
    formData.append("filename", action.payload.filename);

    const response = yield axios.post(`/api/organizations`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set content type to multipart/form-data for file upload
      },
    });

    console.log("RESPONSE IS", response);

    yield put({ type: "FETCH_ORGANIZATIONS" });
  } catch (error) {
    console.log("error in addOrganizationSaga", error);
  }
}

function* deleteOrganizationSaga(action) {
  const organizationId = action.payload.dataId;
  try {
    yield axios.delete(`/api/organizations/${organizationId}`);
    yield put({ type: "FETCH_ORGANIZATIONS" });
  } catch (error) {
    console.log("error with deleteOrganizationSaga request", error);
  }
}

function* editOrganizationSaga(action) {
  try {
    const orgId = action.payload.id;

    // Create a FormData object to send the file data
    const formData = new FormData();
    formData.append("organization_name", action.payload.organization_name);
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
      formData.append("organization_logo", action.payload.uploadedFile);
      formData.append("filename", action.payload.uploadedFile.name);
    } else if (action.payload.organization_logo_base64) {
      formData.append(
        "organization_logo",
        action.payload.organization_logo_base64
      );
      formData.append("filename", action.payload.filename);
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
