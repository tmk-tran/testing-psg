import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* orgDetails(action) {
  try {
    const items = yield axios.get(`/api/orgDetails/${action.payload}`);
    yield put({ type: "SET_ORG_DETAILS", payload: items.data });
  } catch {
    console.log("error in orgDetailsSaga");
  }
}

function* editOrg(action) {
  try {
    yield axios.put(`/api/orgDetails/${action.payload.id}`, action.payload);

    yield put({
      type: "FETCH_ORG_DETAILS",
      payload: action.payload.organization_id,
    });
  } catch {
    console.log("error in editOrgSaga");
  }
}

export default function* orgDetailsSaga() {
  yield takeEvery("FETCH_ORG_DETAILS", orgDetails);
  yield takeEvery("EDIT_ORG_DETAILS", editOrg);
}
