import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* orgNotes(action) {
  try {
    const items = yield axios.get(`/api/orgnotes/${action.payload}`);
    yield put({ type: "SET_ORG_NOTES", payload: items.data });
  } catch {
    console.log("error in orgNotes Saga");
  }
}

function* addNotes(action) {
  try {
    yield axios.post(`/api/orgnotes/`, action.payload);
    yield put({
      type: "FETCH_ORG_NOTES",
      payload: action.payload.organization_id,
    });
  } catch (error) {
    console.log("error in addNotes Saga", error);
  }
}

function* editNotes(action) {
  try {
    yield axios.put(`/api/orgnotes/${action.payload.id}`, action.payload);

    yield put({
      type: "FETCH_ORG_NOTES",
      payload: action.payload.organization_id,
    });
  } catch {
    console.log("error in editNotes Saga");
  }
}

function* deleteOrgNote(action) {
  const noteId = action.payload.noteId;
  const orgId = action.payload.entityId;
  try {
    yield axios.delete(`/api/orgnotes/${noteId}`);

    yield put({ type: "FETCH_ORG_NOTES", payload: orgId });
  } catch (error) {
    console.log("error with deleteOrgNotes request", error);
  }
}

export default function* orgDetailsSaga() {
  yield takeEvery("FETCH_ORG_NOTES", orgNotes);
  yield takeEvery("ADD_ORG_NOTES", addNotes);
  yield takeEvery("EDIT_ORG_NOTES", editNotes);
  yield takeEvery("DELETE_ORG_NOTE", deleteOrgNote);
}
