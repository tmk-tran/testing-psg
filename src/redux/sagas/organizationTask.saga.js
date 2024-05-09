import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* organizationTask(action) {
  console.log(action.payload);
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
      organization_tasks (filter: "organization_id = ${action.payload.id}" ordering: "due_date ASC"){
        id
        category
        task
        organization_id
        assign
        due_date
        description
        task_status
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
    console.log("FETCH request from orgTask.saga, ITEMS = ", response.data);
    yield put({ type: "SET_ORG_TASKS", payload: response.data.organization_tasks });
  } catch (error) {
    console.log("error in orgTasks Saga", error);
  }
}

function* fetchAllOrganizationTasks(action) {
  console.log(action.payload);
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
      organization_tasks  (ordering: "due_date ASC"){
        id
        category
        task
        organization_id
        assign
        due_date
        description
        task_status
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
    console.log("FETCH request from allOrgTask.saga, ITEMS = ", response.data);
    yield put({ type: "SET_ORG_TASKS", payload: response.data.organization_tasks });
  } catch (error) {
    console.log("error in allOrgTasks Saga", error);
  }
}

function* addOrganizationTask(action) {
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

    const newTask = action.payload.newTask
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `mutation($input: organization_tasksInput){
        create_organization_tasks (input: $input){
          id
          category
          task
          organization_id
          assign
          due_date
          description
          task_status
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
        "category": newTask.category,
        "task": newTask.task,
        "organization_id": Number(newTask.organization_id),
        "organization_name": newTask.organization_name,
        "assign": newTask.assign,
        "due_date": newTask.due_date,
        "description": newTask.description,
        "task_status": newTask.task_status
      }
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_ALL_ORGANIZATION_TASKS", payload: auth_response });
  } catch (error) {
    console.log("error in addNotes Saga", error);
  }
}

function* editOrganizationTask(action) {
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

    const updatedTask = action.payload.updatedTask
    console.log(updatedTask)
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = ` mutation($input: organization_tasksInput, $id: ID!){
      update_organization_tasks (input: $input id: $id){
        id
        category
        task
        organization_id
        assign
        due_date
        description
        task_status
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
        "assign": updatedTask.assign,
        "due_date": updatedTask.due_date,
        "task_status": updatedTask.task_status
      },
      "id": Number(updatedTask.id)
    }));

    const response = yield axios.post(QUERY_URL, data, queryConfig);
    console.log(response)
    yield put({ type: "FETCH_ALL_ORGANIZATION_TASKS", payload: auth_response });
  } catch (error) {
    console.log("error with updateOrgTask request", error);
  }
}

function* changeAssignedOrg(action) {
  const taskId = action.payload.id;
  const orgId = action.payload.organizationId;
  console.log(action.payload);

  try {
    yield axios.put(`/api/organizationTask/${taskId}`, action.payload);
    console.log("orgTask action.payload = ", action.payload);
    yield put({
      type: "FETCH_ALL_ORGANIZATION_TASKS",
      payload: orgId,
    });
  } catch (err) {
    console.log("error in editOrgTask Saga", err);
  }
}

function* deleteOrganizationTask(action) {
  try {
    const items = yield axios.delete(
      `/api/tasks/organizations/${action.payload.id}`
    );
    console.log(
      "FETCH request from organizationsTask.saga, ITEMS FOR delete = ",
      items
    );
    console.log("organizationsTask action.payload = ", action.payload);

    yield put({
      type: "FETCH_ALL_ORGANIZATION_TASKS",
      payload: action.payload.id,
    });
  } catch (err) {
    console.log("error in deleteOrganizationsTask Saga", err);
  }
}

export default function* organizationTaskSaga() {
  yield takeEvery("FETCH_ORGANIZATION_TASKS", organizationTask);
  yield takeEvery("FETCH_ALL_ORGANIZATION_TASKS", fetchAllOrganizationTasks);
  yield takeEvery("ADD_ORGANIZATION_TASK", addOrganizationTask);
  yield takeEvery("UPDATE_ORGANIZATION_TASK", editOrganizationTask);
  yield takeEvery("CHANGE_ASSIGNED_ORG", changeAssignedOrg);
  yield takeEvery("ARCHIVE_ORGANIZATION_TASK", deleteOrganizationTask);
}
