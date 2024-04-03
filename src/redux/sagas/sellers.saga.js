import axios from "axios";
import { put, takeEvery } from "redux-saga/effects";

function* fetchSellers(action) {
 
  try {
    console.log(action.payload);
    const orgId = action.payload.id
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{
      sellers(filter: "organization_id = ${orgId}"){
        id
        refId
        lastname
        firstname
        level
        teacher
        initial_books
        additional_books
        books_returned
        cash
        checks
        digital
        donations
        notes
        organization_id
        is_deleted
        digital_donations
        books_due
        coupon_book_id
        organization{
          organization_name
          address
          city
          state
          zip
        }
        transactions_collection{
          physical_book_cash
          physical_book_digital
          digital_book_credit
          seller_earnings
        }
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
    console.log(response)
    yield put({ type: "SET_SELLERS", payload: response.data.sellers })
  } catch (err) {
      console.log("error in sellers Saga", err)
  }
}

function* fetchSellerByRefId(action) {

  try {
    console.log(action.payload);
    const refId = action.payload.refId;
    const auth_response = action.payload.auth
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `{
      sellers(filter: "refId = ${refId}"){
        id
        refId
        lastname
        firstname
        level
        teacher
        initial_books
        additional_books
        books_returned
        cash
        checks
        digital
        donations
        notes
        organization_id
        is_deleted
        digital_donations
        books_due
        coupon_book_id
        organization{
          organization_name
          address
          city
          state
          zip
        }
        transactions_collection{
          physical_book_cash
          physical_book_digital
          digital_book_credit
          seller_earnings
        }
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
    console.log(response)
    yield put({ type: "SET_SELLER_BY_REFID", payload: response.data.sellers })
  } catch (err) {
      console.log("error in fetching seller by refId", err)
  }
}

function* addSeller(action) {
  try {
    const newSeller = action.payload.newSeller;
    const auth_response = action.payload.auth;
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `mutation ($input: sellersInput) {
      create_sellers (input: $input) {
        id
        refId
        lastname
        firstname
        level
        teacher
        initial_books
        additional_books
        books_returned
        cash
        checks
        digital
        donations
        notes
        organization_id
        is_deleted
        digital_donations
        books_due
        coupon_book_id
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

    data.append("variables", JSON.stringify({
        "input": {
          "refId": newSeller.refId,
          "lastname": newSeller.lastname,
          "firstname": newSeller.firstname,
          "level": newSeller.level,
          "teacher": newSeller.teacher,
          "initial_books": Number(newSeller.initial_books),
          "additional_books": Number(newSeller.additional_books),
          "books_returned": Number(newSeller.books_returned),
          "cash": Number(newSeller.cash),
          "checks": Number(newSeller.checks),
          "digital": Number(digital),
          "donations": Number(donations),
          "notes": newSeller.notes,
          "organization_id": Number(newSeller.organization_id),
          "digital_donations": Number(newSeller.digital_donations),
          "books_due": Number(newSeller.books_due),
          "coupon_book_id": Number(newSeller.coupon_book_id)
        } 
    }));

    console.log(data);

    yield axios.post(QUERY_URL, data, queryConfig);
    yield put({
      type: "FETCH_SELLERS",
      payload: {id: newSeller.organization_id, auth: auth_response}
    });
  } catch (error) {
    console.log("error in addSeller Saga", error);
  }
}

function* updateSeller(action) {
  try {
    const editedSeller = action.payload.editedSeller;
    const auth_response = action.payload.auth;
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `mutation ($input: sellersInput $id: ID!) {
      update_sellers (input: $input id: $id) {
        id
        refId
        lastname
        firstname
        level
        teacher
        initial_books
        additional_books
        books_returned
        cash
        checks
        digital
        donations
        notes
        organization_id
        is_deleted
        digital_donations
        books_due
        coupon_book_id
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

    data.append("variables", JSON.stringify({
        "input": {
          "refId": editedSeller.refId,
          "lastname": editedSeller.lastname,
          "firstname": editedSeller.firstname,
          "level": editedSeller.level,
          "teacher": editedSeller.teacher,
          "initial_books": Number(editedSeller.initial_books),
          "additional_books": Number(editedSeller.additional_books),
          "books_returned": Number(editedSeller.books_returned),
          "cash": Number(editedSeller.cash),
          "checks": Number(editedSeller.checks),
          "digital": Number(digital),
          "donations": Number(donations),
          "notes": editedSeller.notes,
          "organization_id": Number(editedSeller.organization_id),
          "digital_donations": Number(editedSeller.digital_donations),
          "books_due": Number(editedSeller.books_due),
          "coupon_book_id": Number(editedSeller.coupon_book_id)
        }, 
        "id": Number(editedSeller.id)
    }));

    console.log(data);

    yield axios.post(QUERY_URL, data, queryConfig);
    yield put({
      type: "FETCH_SELLERS",
      payload: {id: editedSeller.organization_id, auth: auth_response}
    });
  } catch (error) {
    console.log("error in updateSeller Saga", error);
  }
}

function* archiveSeller(action) {
  try {
    const archivedSeller = action.payload.archiveSeller;
    const auth_response = action.payload.auth;
    const ACCESS_TOKEN = auth_response.data.access_token;
    const QUERY_URL = auth_response.data.routes.query;
    const query = `mutation ($input: sellersInput $id: ID!) {
      update_sellers (input: $input id: $id) {
        id
        refId
        lastname
        firstname
        level
        teacher
        initial_books
        additional_books
        books_returned
        cash
        checks
        digital
        donations
        notes
        organization_id
        is_deleted
        digital_donations
        books_due
        coupon_book_id
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

    data.append("variables", JSON.stringify({
        "input": {
          "refId": archivedSeller.refId,
          "lastname": archivedSeller.lastname,
          "firstname": archivedSeller.firstname,
          "level": archivedSeller.level,
          "teacher": archivedSeller.teacher,
          "initial_books": Number(archivedSeller.initial_books),
          "additional_books": Number(archivedSeller.additional_books),
          "books_returned": Number(archivedSeller.books_returned),
          "cash": Number(archivedSeller.cash),
          "checks": Number(archivedSeller.checks),
          "digital": Number(digital),
          "donations": Number(donations),
          "notes": archivedSeller.notes,
          "organization_id": Number(archivedSeller.organization_id),
          "is_deleted": true,
          "digital_donations": Number(archivedSeller.digital_donations),
          "books_due": Number(archivedSeller.books_due),
          "coupon_book_id": Number(archivedSeller.coupon_book_id)
        }, 
        "id": Number(archivedSeller.id)
    }));

    console.log(data);

    yield axios.post(QUERY_URL, data, queryConfig);
    yield put({
      type: "FETCH_SELLERS",
      payload: {id: archivedSeller.organization_id, auth: auth_response}
    });
  } catch (error) {
    console.log("error in updateSeller Saga", error);
  }
}

export default function* merchantCommentsSaga() {
  yield takeEvery("FETCH_SELLERS", fetchSellers);
  yield takeEvery("FETCH_SELLER_BY_REFID", fetchSellerByRefId)
  yield takeEvery("ADD_SELLER", addSeller);
  yield takeEvery("EDIT_SELLER", updateSeller);
  yield takeEvery("ARCHIVE_SELLER", archiveSeller);
}
