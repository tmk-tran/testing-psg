import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser(action) {
  try {
    const auth_response = action.payload
    
    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const ACCESS_TOKEN = auth_response.access_token;
const QUERY_URL = auth_response.routes.query;
const query = `{
      user{ 
    id
    username
    password
    is_admin
    is_deleted
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

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: response.data.user[0]});
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
}

export default userSaga;
