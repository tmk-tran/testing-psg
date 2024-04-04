const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
// const fetch = require("node-fetch");
const axios = require('axios');

const app = express();

const sessionMiddleware = require("./modules/session-middleware");
const passport = require("./strategies/user.strategy");

// // Route includes
const userRouter = require("./routes/user.router");
// const groupRouter = require("./routes/group.details.router");
// const orgDetailsRouter = require("./routes/orgDetails.router");
// const organizationsRouter = require("./routes/organizations.router");
// const fundraisersRouter = require("./routes/fundraisers.router");
// const archivedOrganizationsRouter = require("./routes/archivedOrganizations.router");
// const allGroupsRouter = require("./routes/allGroups.router");
const couponBookRouter = require("./routes/couponbook.router");
const groupAdminRouter = require("./routes/groupAdmin.router");
// const orgNotesRouter = require("./routes/orgNotes.router");
// const allUsersRouter = require("./routes/allUsers.router");
const couponRouter = require("./routes/coupon.router");
// const merchantsRouter = require("./routes/merchants.router");
// const organizationTaskRouter = require("./routes/organizationTask.router");
// const merchantNotesRouter = require("./routes/merchantNotes.router");
// const merchantTaskRouter = require("./routes/merchantTask.router");
// const allTasksMRouter = require("./routes/allTasksM.router");
// const allTasksORouter = require("./routes/allTasksO.router");
// const merchantCommentsRouter = require("./routes/merchantComments.router");
// const locationsRouter = require("./routes/locations.router");

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// /* Routes */
app.use("/api/user", userRouter);
// app.use("/api/group", groupRouter);
// app.use("/api/orgnotes", orgNotesRouter);
// app.use("/api/orgdetails", orgDetailsRouter);
// app.use("/api/organizations", organizationsRouter);
// app.use("/api/fundraisers", fundraisersRouter);
// app.use("/api/archivedOrganizations", archivedOrganizationsRouter);
// app.use("/api/allGroups", allGroupsRouter);
// app.use("/api/archivedOrganizations", archivedOrganizationsRouter);
app.use("/api/couponbook", couponBookRouter);
app.use("/api/groupAdmin", groupAdminRouter);
// app.use("/api/allUsers", allUsersRouter);
app.use("/api/coupon", couponRouter);
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


// Route includes //
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
// const sellersRouter = require("./routes/sellers.router");
// const sellerPageRouter = require("./routes/sellerPage.router");
// const customersRouter = require("./routes/customers.router");
// const transactionsRouter = require("./routes/transactions.router");
// const redemptionRouter = require("./routes/couponRedemption.router");
// const paypalRouter = require("./routes/paypal.router");
// const userCouponRouter = require("./routes/userCoupon.router");

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

// // Body parser middleware //
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));



// // Start up passport sessions //
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes //
// app.use("/api/user", userRouter);
// app.use("/api/group", groupRouter);
// app.use("/api/orgnotes", orgNotesRouter);
// app.use("/api/orgdetails", orgDetailsRouter);
// app.use("/api/organizations", organizationsRouter);
// // app.use("/api/fundraisers", fundraisersRouter);
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
// app.use("/api/sellers", sellersRouter);
// app.use("/api/seller", sellerPageRouter);
// app.use("/api/customers", customersRouter);
// app.use("/api/transactions", transactionsRouter);
// app.use("/api/redeem", redemptionRouter);
// app.use("/api/paypal", paypalRouter);
// app.use("/api/userCoupon", userCouponRouter);

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

// Active Campaign get route to retreive a user by email
// app.get(`/api/fetchContact`, async (req, res) => {

// try {
//   const checkedResponse = await axios.get(`https://${process.env.ac_address}/api/${process.env.version}/contacts?filters[email]=${email}`);
//   console.log(checkedResponse)
//   res.send(response.data.contacts)
// } catch (error) {
//   console.log('Error fetching contact from Active Campaign', (error))
//   res.sendStatus(500)
// }
// });

app.post(`/api/contact`, async (req, res) => {

  function generatePassword() {
    const length = Math.floor(Math.random() * 4) + 7;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  const randomPassword = generatePassword();
  console.log(randomPassword);

  try {
    const email = req.body.email
    const apiKey = process.env.AC_API_KEY;
    const checkedResponse = await axios.get(`https://${process.env.ac_address}/api/${process.env.version}/contacts?filters[email]=${email}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': apiKey
        }
      }
    )
    console.log(checkedResponse)
    const returnerId = checkedResponse.data ? checkedResponse.data.contacts.id : null;


    if (checkedResponse.data.message = "No Result found for Subscriber with id 0") {
      // code block runs to adda a new contact if there is no contact response from active campaign
      const apiKey = process.env.AC_API_KEY;
      const data = {
        "contact": {
          "firstName": req.body.firstName,
          "lastName": req.body.lastName,
          "phone": req.body.phone,
          "email": req.body.email,
          "fieldValues": [
            {
              "field": "1",
              "value": req.body.address
            },
            {
              "field": "2",
              "value": req.body.city
            },
            {
              "field": "3",
              "value": req.body.state
            },
            {
              "field": "4",
              "value": req.body.zip
            },
            {
              "field": "59",
              "value": req.body.organization
            },
            {
              "field": "60",
              "value": req.body.url
            },
            {
              "field": "63",
              "value": req.body.year
            },
            {
              "field": "64",
              "value": req.body.email
            },
            {
              "field": "66",
              "value": req.body.donation
            },
            {
              "field": "65",
              "value": randomPassword
            }
          ]
        }
      }

      const response1 = await axios.post(
        `https://${process.env.ac_address}/api/${process.env.version}/contacts`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            'Api-Token': apiKey
          }
        }
      );
      console.log('Response from ActiveCampaign:', response1.data.contact);
      const contactId = response1.data.contact.id;
      console.log(contactId)

      let list = 0;
      switch (req.body.city) {
        case "Fargo":
          list = 10
          break;
        case "Grand Forks":
          list = 11
          break;
        default:
          list = 0
          break;
      }

      const response2 = await axios.post(
        `https://${process.env.ac_address}/api/${process.env.version}/contactLists`,
        JSON.stringify({
          "contactList": {
            "list": list,
            "contact": contactId,
            "status": 1
          }
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Api-Token': apiKey
          }
        }
      );
      console.log('Response from adding contact to list:', response2.data);

      let tag = 0

      if (req.body.bookType === "Physical Coupon Book" && req.body.type === "cash") {
        tag = 58
      } else if (req.body.booktype === "Physical Coupon Book" && req.body.type === "credit") {
        tag = 56
      } else if (req.body.bookType === "Donate") {
        tag = 59
      } else {
        tag = 0
      }

      const response3 = await axios.post(
        `https://${process.env.ac_address}/api/${process.env.version}/contactTags`,
        JSON.stringify({
          "contactTag": {
            "contact": contactId,
            "tag": tag,
          }
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Api-Token': apiKey
          }
        }
      );
      console.log('Response from adding tag to contact:', response3.data);
      res.sendStatus(200)

    } else {
      // Code block to run if there is already a user in the active campaign database, updates existing information and updates the list a user is added too
      const apiKey = process.env.AC_API_KEY;
      const data = {
        "contact": {
          "firstName": req.body.firstName,
          "lastName": req.body.lastName,
          "phone": req.body.phone,
          "email": req.body.email,
          "fieldValues": [
            {
              "field": "1",
              "value": req.body.address
            },
            {
              "field": "2",
              "value": req.body.city
            },
            {
              "field": "3",
              "value": req.body.state
            },
            {
              "field": "4",
              "value": req.body.zip
            },
            {
              "field": "59",
              "value": req.body.organization
            },
            {
              "field": "60",
              "value": req.body.url
            },
            {
              "field": "63",
              "value": req.body.year
            },
            {
              "field": "64",
              "value": req.body.email
            },
            {
              "field": "66",
              "value": req.body.donation
            }
          ]
        }
      }
      //Updates current active campaign data
      const response1 = await axios.put(
        `https://${process.env.ac_address}/api/${process.env.version}/contacts/${returnerId}`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            'Api-Token': apiKey
          }
        }
      );
      console.log('Response from ActiveCampaign:', response1.data);
      // const contactId = response1.data.contact.id;

      var list = 0;
      switch (req.body.city) {
        case "Fargo":
          list = 10
          break;
        case "Grand Forks":
          list = 11
          break;
        default:
          list = 0
          break;
      }

      const response2 = await axios.put(
        `https://${process.env.ac_address}/api/${process.env.version}/contactLists`,
        JSON.stringify({
          "list": list,
          "contact": returnerId,
          "status": 1
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Api-Token': apiKey
          }
        }
      );
      console.log('Response from adding contact to list:', response2.data);

      let tag = 0

      if (req.body.bookType === "Physical Coupon Book" && req.body.type === "cash") {
        tag = 58
      } else if (req.body.booktype === "Physical Coupon Book" && req.body.type === "credit") {
        tag = 56
      } else if (req.body.bookType === "Donate") {
        tag = 59
      } else {
        tag = 0
      }

      const response3 = await axios.post(
        `https://${process.env.ac_address}/api/${process.env.version}/contactTags`,
        JSON.stringify({
          "contact": returnerId,
          "tag": tag
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Api-Token': apiKey
          }
        }
      );
      console.log('Response from adding tag to contact:', response3.data);

      res.sendStatus(200)
    };
  } catch (error) {
    console.error('Error sending contact to Active Campaign', error);
    res.sendStatus(500);
  }
});

app.post('/api/recoverPassword', async (req, res) => {
  try {
    const email = req.body.email
    const apiKey = process.env.AC_API_KEY;
    const emailChecked = await axios.get(`https://${process.env.ac_address}/api/${process.env.version}/contacts?filters[email]=${email}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': apiKey
        }
      }
    )
    console.log(emailChecked)
    const id = emailChecked.data.contact.id

    const resetAcc = await axios.post(
      `https://${process.env.ac_address}/api/${process.env.version}/contactTags`,
      JSON.stringify({
        "contact": id,
        "tag": 64
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': apiKey
        }
      }
    );
    console.log('Response from adding tag to contact:', resetAcc.data);
  } catch (error) {

  }
})


// Serve index.html //
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Listen
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
