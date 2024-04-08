import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

function* addContactSaga(action) {
    console.log(action.payload)
    try {
        yield axios({
                method: "POST",
                url: `/api/contact`, 
                data: action.payload
            });
      } catch (error) {
        console.log("error in addContact saga", error);
      }
};

function* recoverPassword(action){
    console.log(action.payload)
    const email = action.payload
    try {
        yield axios({
            method: "POST",
            url: `/api/recoverPassword`, 
            data: {email: email}
        });
      } catch (error) {
        console.log("error in recoverPassword saga", error);
      }
}

export default function* activeCampaignSaga() {
    yield takeEvery("ADD_CONTACT", addContactSaga)
    yield takeEvery("RECOVER_PASSWORD", recoverPassword)
}