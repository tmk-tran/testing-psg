import axios from "axios";
import { takeEvery, put } from "redux-saga/effects";

// function* addContactSaga(action) {
//   console.log("payload from ac saga", action.payload);
//   try {
//     const response = yield axios.post("/api/contact", action.payload);
//     console.log("Response: ", response);

//     if (response.data === "OK") { // Why is there only a console.log here?
//       console.log("Contact created successfully (no password returned)");
//     } else {
//       typeof response.data === "string" && response.data.length > 0;

//       const user = {
//         username: action.payload.email,
//         password: response.data,
//         first_name: action.payload.firstName,
//         last_name: action.payload.lastName,
//       };

//       yield put({ type: "REGISTER", payload: user });
//     }
//   } catch (error) {
//     console.log("error in addContact saga", error);
//   }
// }
function* addContactSaga(action) {
  console.log("payload from ac saga", action.payload);
  try {
    const response = yield axios.post("/api/contact", action.payload);
    console.log("Response from activeCampaign saga: ", response);
    console.log(response.data);

    if (
      response.status === 201 && // Check if status is 201
      response.data && // Ensure response.data exists
      response.data.password // Check if password field exists in response.data
    ) {
      // Create an account for digital books if valid data exists
      const { email, firstName, lastName } = action.payload;

      const user = {
        first_name: firstName,
        last_name: lastName,
        username: email,
        password: response.data.password,
      };

      console.log("Account created for digital book", user);
      yield put({ type: "REGISTER", payload: user }); // Adds user to the application
    } else {
      // No account creation necessary for physical books
      console.log(
        "Contact created successfully - (no PSG account creation necessary)"
      );
    }
  } catch (error) {
    console.log("error in addContact saga", error);
  }
}

function* recoverPassword(action) {
  const email = action.payload;
  try {
    yield axios.post("/api/recoverPassword", { email: email });
  } catch (error) {
    console.log("error in recoverPassword saga", error);
  }
}

export default function* activeCampaignSaga() {
  yield takeEvery("ADD_CONTACT", addContactSaga);
  yield takeEvery("RECOVER_PASSWORD", recoverPassword);
}
