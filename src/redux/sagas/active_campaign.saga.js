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

    // Assuming bookType is passed in action.payload
    const { bookType } = action.payload;

    // if (response.data === "OK") {
    //   console.log("Contact created successfully (no password returned)");
    // } else if (
    //   bookType === "Digital" &&
    //   typeof response.data === "string" &&
    //   response.data.length > 0
    // ) {
    //   // Only create an account for digital books
    //   const user = {
    //     username: action.payload.email,
    //     password: response.data,
    //     first_name: action.payload.firstName,
    //     last_name: action.payload.lastName,
    //   };

    //   yield put({ type: "REGISTER", payload: user });
    // } else {
    //   console.log("No account creation necessary for physical book.");
    // }

    if (response.data === "OK") {
      // No account creation necessary for physical books
      console.log("Contact created successfully (no account creation necessary)");
    } else if (
      bookType === "Fargo - Moorhead (Digital Coupon Book)" &&
      typeof response.data === "string" &&
      response.data.length > 0
    ) {
      // Create an account for digital books if valid data exists
      const { email, firstName, lastName } = action.payload;
    
      const user = {
        username: email,
        password: response.data,
        first_name: firstName,
        last_name: lastName,
      };
    
      yield put({ type: "REGISTER", payload: user });
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
