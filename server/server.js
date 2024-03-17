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
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");
// const fetch = require("node-fetch");
const axios = require('axios');
const app = express();

const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// Route includes //
const userRouter = require("./routes/user.router");
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
app.use("/api/group", groupRouter);
app.use("/api/orgnotes", orgNotesRouter);
app.use("/api/orgdetails", orgDetailsRouter);
app.use("/api/organizations", organizationsRouter);
// app.use("/api/fundraisers", fundraisersRouter);
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

// Serve static files //
app.use(express.static("build"));

// App Set //
const PORT = process.env.PORT || 5000;

// PayPal integration //
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

// Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs //
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    // ADDED FOR FETCH, since 'import' and 'require' didn't work, --> ECMA script confict?? //
    const fetch = (await import("node-fetch")).default; // Dynamic import for node-fetch

    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

// Create an order to start the transaction //
const createOrder = async (cart) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "100.00",
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// Capture payment for the created order to complete the transaction //
const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

app.post("/api/orders", async (req, res) => {
  try {
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});



app.post(`/api/newContact`, async (req, res) => {
    try {
        const apiKey = process.env.AC_API_KEY; 
        const data = req.body 

        const response = await axios.post(
            `https://${process.env.ac_address}/api/${process.env.version}/contacts`,
            JSON.stringify(data),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Token': apiKey
                }
            }
        );
        console.log('Response:', response);
        res.sendStatus(200)
    } catch (error) {
        console.error('Error sending contact to Active Campaign', error);
        res.sendStatus(500);
    }
});


// Serve index.html //
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Listen //
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
