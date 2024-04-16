import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

//Saga to log into Devii Api
function* deviiLogin(action) {
  try {
    console.log(action.payload)
    const user = action.payload;
    // Login to Devii
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const AUTH_URL = "https://api.devii.io/auth";

    const params = new URLSearchParams();
    params.append("login", user.username);
    params.append("password", user.password);
    params.append("tenantid", "10140");

    const response = yield axios.post(AUTH_URL, params, config);
    console.log(response);

    const access_token = response.data.access_token;
    const query_endpoint = response.data.routes.query;
    const role_pbac_endpoint = response.data.routes.roles_pbac;

    // Extract refresh token 
    const refreshToken = response.data.refresh_token;
    if (refreshToken) {
      localStorage.psg_token = refreshToken
      // `refreshToken=${refreshToken}; path=/refresh_token; ${process.env.NODE_ENV === 'production' ? 'secure;' : ''} HttpOnly`;
    } else {
      console.warn("Refresh token not found in response data.");
    }
    // Save off auth object
    yield put({ type: "SET_AUTH", payload: response });
  } catch (error) {
    console.log('Unable to log into Devii API', error)
  }
}

function* deviiAnon() {
  try {
    // Login to Devii
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const AUTH_URL = "https://api.devii.io/anonauth";

    const params = new URLSearchParams();
    params.append("10140", "20519");

    const result = yield axios.post(AUTH_URL, params, config);
    console.log(result);

    const access_token = result.data.access_token;
    const query_endpoint = result.data.routes.query;
    const role_pbac_endpoint = result.data.routes.roles_pbac;

    const refreshToken = response.data.refresh_token;
    if (refreshToken) {
      localStorage.psg_token = refreshToken
      // `refreshToken=${refreshToken}; path=/refresh_token; ${process.env.NODE_ENV === 'production' ? 'secure;' : ''} HttpOnly`;
    } else {
      console.warn("Refresh token not found in response data.");
    }

    yield put({ type: "SET_AUTH", payload: response });
  } catch (error) {
    console.log('Error with Devii anon login', error);
  }
}

function* deviiSaga() {
  yield takeEvery('DEVII_LOGIN', deviiLogin);
  yield takeEvery('ANON_LOGIN', deviiAnon)
}

export default deviiSaga;