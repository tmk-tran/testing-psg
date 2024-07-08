import { all } from "redux-saga/effects";
import loginSaga from "./login.saga";
import registrationSaga from "./registration.saga";
import userSaga from "./user.saga";
import userOrgAdminSaga from "./userOrgAdmin.saga";
import regionSaga from "./region.saga";

import orgDetailsSaga from "./orgDetails.saga";
import organizationsSaga from "./organizations.saga";
import groupSaga from "./group.saga";
import fundraiserSaga from "./fundraiser.saga";
import archivedOrganizationsSaga from "./archivedOrganizations.saga";
import allGroupsSaga from "./allGroups.saga";
import couponBookSaga from "./couponBook.saga";
import groupAdminSaga from "./groupAdmin.saga";
import orgNotesSaga from "./orgNotes.saga";
import allUsersSaga from "./allUsers.saga";
import couponSaga from "./coupon.saga";
import merchantsSaga from "./merchants.saga";
import merchantNotesSaga from "./merchantNotes.saga";
import merchantTaskSaga from "./merchantTask.saga";
import organizationTaskSaga from "./organizationTask.saga";
import merchantCommentsSaga from "./merchantComments.saga";
import locationsSaga from "./locations.saga";
import sellersSaga from "./sellers.saga";
import sellerPageSaga from "./sellerPage.saga";
import customersSaga from "./customers.saga";
import transactionsSaga from "./transactions.saga";
import redeemSaga from "./couponRedeem.saga";
import paypalSaga from "./paypal.saga";
import userCouponSaga from "./userCoupon.saga";
import activeCampaignSaga from "./active_campaign.saga";
import regionSaga from "./region.saga";

export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),
    userOrgAdminSaga(),
    regionSaga(),
    orgDetailsSaga(),
    organizationsSaga(),
    groupSaga(),
    fundraiserSaga(),
    archivedOrganizationsSaga(),
    allGroupsSaga(),
    couponBookSaga(),
    groupAdminSaga(),
    orgNotesSaga(),
    allUsersSaga(),
    couponSaga(),
    merchantsSaga(),
    merchantNotesSaga(),
    merchantTaskSaga(),
    organizationTaskSaga(),
    merchantCommentsSaga(),
    locationsSaga(),
    sellersSaga(),
    sellerPageSaga(),
    customersSaga(),
    transactionsSaga(),
    redeemSaga(),
    paypalSaga(),
    userCouponSaga(),
    activeCampaignSaga(),
    regionSaga(),
  ]);
}
