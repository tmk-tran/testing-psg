import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "LOGIN" actions
function* loginUser(action) {
  try {
    // clear any existing error on the login page
    yield put({ type: 'CLEAR_LOGIN_ERROR' });
    // send the action.payload as the body
    // the config includes credentials which
    // allow the server session to recognize the user
    try {
      // Login to Devii
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
    
      const AUTH_URL = "https://api.devii.io/auth";
    
      const params = new URLSearchParams();
      params.append("login", action.payload.username);
      params.append("password", action.payload.password);
      params.append("tenantid", "10140");
    
      const response = yield axios.post(AUTH_URL, params, config);
      console.log(response);
      
      const access_token = response.data.access_token;
      const query_endpoint = response.data.routes.query;
      const role_pbac_endpoint = response.data.routes.roles_pbac;
      // Save off auth object
      yield put ({type: "SET_AUTH", payload: response});
      yield put({ type: 'FETCH_USER', payload: response.data });
      yield put ({type: "FETCH_ROLES", payload: response.data})
      
    } catch (error) {
      console.log("Error in auth fetch request", error);
    }
    
    // after the user has logged in
    // get the user information from the server
    
  } catch (error) {
    console.log('Error with user login:', error);
    if (error) {
      // The 401 is the error status sent from passport
      // if user isn't in the database or
      // if the username and password don't match in the database
      yield put({ type: 'LOGIN_FAILED' });
    } else {
      // Got an error that wasn't a 401
      // Could be anything, but most common cause is the server is not started
      yield put({ type: 'LOGIN_FAILED_NO_CODE' });
    }
  }
}

// worker Saga: will be fired on "LOGOUT" actions
function* logoutUser(action) {
  try {
   

    // the config includes credentials which
    // allow the server session to recognize the user
    // when the server recognizes the user session
    // it will end the session
  

    // now that the session has ended on the server
    // remove the client-side user object to let
    // the client-side code know the user is logged out
    yield put({ type: 'UNSET_USER' });
  } catch (error) {
    console.log('Error with user logout:', error);
  }
}

function* loginSaga() {
  yield takeLatest('LOGIN', loginUser);
  yield takeLatest('LOGOUT', logoutUser);
}

export default loginSaga;
