// const express = require("express");
// const bodyParser = require("body-parser");
// require("dotenv").config();

// const app = express();

// const sessionMiddleware = require("./modules/session-middleware");
// const passport = require("./strategies/user.strategy");

// // Route includes
// const userRouter = require("./routes/user.router");
// const groupRouter = require("./routes/group.details.router");
// const orgDetailsRouter = require("./routes/orgDetails.router");
// const organizationsRouter = require("./routes/organizations.router");
// const fundraisersRouter = require("./routes/fundraisers.router");
// const archivedOrganizationsRouter = require("./routes/archivedOrganizations.router");
// const allGroupsRouter = require("./routes/allGroups.router");
// const couponBookRouter = require("./routes/couponbook.router");
// const groupAdminRouter = require("./routes/groupAdmin.router");
// const orgNotesRouter = require("./routes/orgNotes.router");
// const allUsersRouter = require("./routes/allUsers.router");
// const couponRouter = require("./routes/coupon.router");
// const merchantsRouter = require("./routes/merchants.router");
// const organizationTaskRouter = require("./routes/organizationTask.router");
// const merchantNotesRouter = require("./routes/merchantNotes.router");
// const merchantTaskRouter = require("./routes/merchantTask.router");
// const allTasksMRouter = require("./routes/allTasksM.router");
// const allTasksORouter = require("./routes/allTasksO.router");
// const merchantCommentsRouter = require("./routes/merchantComments.router");
// const locationsRouter = require("./routes/locations.router");

// // Body parser middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Passport Session Configuration //
// app.use(sessionMiddleware);

// // start up passport sessions
// app.use(passport.initialize());
// app.use(passport.session());

// /* Routes */
// app.use("/api/user", userRouter);
// app.use("/api/group", groupRouter);
// app.use("/api/orgnotes", orgNotesRouter);
// app.use("/api/orgdetails", orgDetailsRouter);
// app.use("/api/organizations", organizationsRouter);
// app.use("/api/fundraisers", fundraisersRouter);
// app.use("/api/archivedOrganizations", archivedOrganizationsRouter);
// app.use("/api/allGroups", allGroupsRouter);
// app.use("/api/archivedOrganizations", archivedOrganizationsRouter);
// app.use("/api/couponbook", couponBookRouter);
// app.use("/api/groupAdmin", groupAdminRouter);
// app.use("/api/allUsers", allUsersRouter);
// app.use("/api/coupon", couponRouter);
// app.use("/api/merchants", merchantsRouter);
// app.use("/api/merchantNotes", merchantNotesRouter);
// app.use("/api/merchantTask", merchantTaskRouter);
// app.use("/api/organizationTask", organizationTaskRouter);
// app.use("/api/tasks/merchants", allTasksMRouter);
// app.use("/api/tasks/organizations", allTasksORouter);
// app.use("/api/merchantComments", merchantCommentsRouter);
// app.use("/api/locations", locationsRouter);

// // Serve static files
// app.use(express.static("build"));

// // App Set //
// const PORT = process.env.PORT || 5000;

// /** Listen * */
// app.listen(PORT, () => {
//   console.log(`Listening on port: ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");
// const fetch = require("node-fetch");
const axios = require("axios"); // Import Axios

const app = express();

const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// Route includes //
const userRouter = require("./routes/user.router");
const regionRouter = require("./routes/region.router");
const groupRouter = require("./routes/group.details.router");
const orgDetailsRouter = require("./routes/orgDetails.router");
const organizationsRouter = require("./routes/organizations.router");
const fundraisersRouter = require("./routes/fundraisers.router");
const archivedOrganizationsRouter = require("./routes/archivedOrganizations.router");
const allGroupsRouter = require("./routes/allGroups.router");
const couponBookRouter = require("./routes/couponbook.router");
const groupAdminRouter = require("./routes/groupAdmin.router");
const orgNotesRouter = require("./routes/orgNotes.router");
const allUsersRouter = require("./routes/allUsers.router");
const couponRouter = require("./routes/coupon.router");
const merchantsRouter = require("./routes/merchants.router");
const organizationTaskRouter = require("./routes/organizationTask.router");
const merchantNotesRouter = require("./routes/merchantNotes.router");
const merchantTaskRouter = require("./routes/merchantTask.router");
const allTasksMRouter = require("./routes/allTasksM.router");
const allTasksORouter = require("./routes/allTasksO.router");
const merchantCommentsRouter = require("./routes/merchantComments.router");
const locationsRouter = require("./routes/locations.router");
const sellersRouter = require("./routes/sellers.router");
const sellerPageRouter = require("./routes/sellerPage.router");
const customersRouter = require("./routes/customers.router");
const transactionsRouter = require("./routes/transactions.router");
const redemptionRouter = require("./routes/couponRedemption.router");
const paypalRouter = require("./routes/paypal.router");
const userCouponRouter = require("./routes/userCoupon.router");

// // Add this middleware to set the CORS headers
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, OPTIONS, PUT, PATCH, DELETE'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   next();
// });

app.use(
  cors({
    origin: "https://www.paypal.com",
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Body parser middleware //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// Start up passport sessions //
app.use(passport.initialize());
app.use(passport.session());

// Routes //
app.use("/api/user", userRouter);
app.use("/api/region", regionRouter);
app.use("/api/group", groupRouter);
app.use("/api/orgnotes", orgNotesRouter);
app.use("/api/orgdetails", orgDetailsRouter);
app.use("/api/organizations", organizationsRouter);
app.use("/api/fundraisers", fundraisersRouter);
app.use("/api/archivedOrganizations", archivedOrganizationsRouter);
app.use("/api/allGroups", allGroupsRouter);
app.use("/api/archivedOrganizations", archivedOrganizationsRouter);
app.use("/api/couponbook", couponBookRouter);
app.use("/api/groupAdmin", groupAdminRouter);
app.use("/api/allUsers", allUsersRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/merchants", merchantsRouter);
app.use("/api/merchantNotes", merchantNotesRouter);
app.use("/api/merchantTask", merchantTaskRouter);
app.use("/api/organizationTask", organizationTaskRouter);
app.use("/api/tasks/merchants", allTasksMRouter);
app.use("/api/tasks/organizations", allTasksORouter);
app.use("/api/merchantComments", merchantCommentsRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/sellers", sellersRouter);
app.use("/api/seller", sellerPageRouter);
app.use("/api/customers", customersRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/redeem", redemptionRouter);
app.use("/api/paypal", paypalRouter);
app.use("/api/userCoupon", userCouponRouter);

// Serve static files //
app.use(express.static("build"));

// App Set //
const PORT = process.env.PORT || 5000;

// PayPal integration //
const { REACT_APP_PAYPAL_CLIENT_ID, REACT_APP_PAYPAL_CLIENT_SECRET } =
  process.env;

// console.log("server: client id = ",REACT_APP_PAYPAL_CLIENT_ID);

const base = "https://api-m.sandbox.paypal.com";

// Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs
const generateAccessToken = async () => {
  try {
    if (!REACT_APP_PAYPAL_CLIENT_ID || !REACT_APP_PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }

    const auth = Buffer.from(
      `${REACT_APP_PAYPAL_CLIENT_ID}:${REACT_APP_PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      `${base}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw error;
  }
};

// Create an order to start the transaction
const createOrder = async (cart) => {
  // Calculate total amount based on the cart items
  const totalAmount = cart
    .reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0)
    .toFixed(2);

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: totalAmount,
        },
      },
    ],
  };

  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  console.log("RESPONSE FROM SERVER, createOrder: ", response.data);
  return response.data;
};

// Capture payment for the created order to complete the transaction
const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await axios.post(url, null, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// API routes for handling PayPal checkout
app.post("/api/orders", async (req, res) => {
  try {
    const { cart } = req.body;
    console.log("From server, request from CART: ", cart);
    const order = await createOrder(cart);
    res.json(order);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const capturedOrder = await captureOrder(orderID);
    res.json(capturedOrder);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Listen
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
