//Imports used for this saga
import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

//Fetches fundraiser data based on the group id
function* fetchFundraisersSaga(action) {
  try {
    const response = yield axios.get(
      `/api/fundraisers/groupfundraisers/${action.payload}`
    );
    yield put({ type: "SET_FUNDRAISERS", payload: response.data });
  } catch (err) {
    console.log("Error fetching fundraisers ", err);
  }
}

// Fetches fundraiser data based on organization id
function* fetchOrgFundraisersSaga(action) {
  try {
    const response = yield axios.get(`/api/fundraisers/${action.payload}`);
    yield put({ type: "SET_ORG_FUNDRAISERS", payload: response.data });
  } catch (err) {
    console.log("Error fetching ORG fundraisers ", err);
  }
}

//Saga used to add a fundraiser, will then fetch the updated list of fundraisers
function* addFundraiserSaga(action) {
  try {
    yield axios.post("/api/fundraisers", action.payload);
    yield put({
      type: "FETCH_FUNDRAISERS",
      payload: Number(action.payload.group_id),
    });
  } catch (err) {
    console.log("Unable to add fundraiser", err);
  }
}

//Saga used to update the amounts in a fundraiser, will then fetch the updated fundraiser data
function* updatedFundraiserAmountsSaga(action) {
  try {
    yield axios.put(`/api/fundraisers/${action.payload.id}`, action.payload);
    yield put({
      type: "FETCH_FUNDRAISERS",
      payload: Number(action.payload.group_id),
    });
  } catch (err) {
    console.log("Unable to update amounts for fundraisers", err);
  }
}
//Saga used to update a fundraiser to closed, will then fetch updated fundraisers data
function* closeFundraiserSaga(action) {
  try {
    yield axios.put(`/api/fundraisers/close/${action.payload.id}`);
    yield put({
      type: "FETCH_FUNDRAISERS",
      payload: Number(action.payload.group_id),
    });
  } catch (err) {
    console.log("Error setting fundraiser to closed", err);
  }
}
//Saga used to update a fundraiser to open, will then fetch updated fundraisers data
function* openFundraiserSaga(action) {
  try {
    yield axios.put(`/api/fundraisers/open/${action.payload.id}`);
    yield put({
      type: "FETCH_FUNDRAISERS",
      payload: Number(action.payload.group_id),
    });
  } catch (err) {
    console.log("Error setting fundraiser to closed", err);
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
