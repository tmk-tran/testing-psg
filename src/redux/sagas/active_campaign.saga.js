import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* addContactSaga(action) {
    console.log("payload from ac saga", action.payload)
    try {
        // const response = yield axios({
        //     method: "POST",
        //     url: `/api/contact`,
        //     data: action.payload
        // });
        const response = yield axios.post("/api/contact", action.payload);
        console.log("Response: ", response);
        
        if (response.data === "OK") {
            console.log("Contact created successfully (no password returned)");
          } else { 
            (typeof response.data === "string" && response.data.length > 0) 
            
            const user = {
              username: action.payload.email,
              password: response.data,
              first_name: action.payload.firstName,
              last_name: action.payload.lastName
            };
      
            yield put({ type: "REGISTER", payload: user });
        }
    } catch (error) {
        console.log("error in addContact saga", error);
    }

};

function* recoverPassword(action) {
    console.log(action.payload)
    const email = action.payload
    try {
        yield axios({
            method: "POST",
            url: `/api/recoverPassword`,
            data: { email: email }
        });
    } catch (error) {
        console.log("error in recoverPassword saga", error);
    }
}

export default function* activeCampaignSaga() {
    yield takeEvery("ADD_CONTACT", addContactSaga)
    yield takeEvery("RECOVER_PASSWORD", recoverPassword)
}