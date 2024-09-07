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

const base = "https://api-m.sandbox.paypal.com";
// const base = "https://api-m.paypal.com"; // URL for PRODUCTION

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
    // console.log("From server, request from CART: ", cart);
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~ Active Campaign Section ~~~~~~ //
app.post(`/api/contact`, async (req, res) => {
  function generatePassword(lastName, firstName) {
    if (!lastName || !firstName) {
      throw new Error("Missing required arguments: lastName and firstName");
    }

    const sanitizedLastName = lastName.toLowerCase().replace(/\W/g, "");

    const firstInitial = firstName[0].toLowerCase();

    const randomNumber1 = Math.floor(Math.random() * 10);
    const randomNumber2 = Math.floor(Math.random() * 10);

    return `${sanitizedLastName}${firstInitial}${randomNumber1}${randomNumber2}`;
  }

  // const randomPassword = generatePassword(
  //   req.body.firstName,
  //   req.body.lastName
  // );
  // Declare randomPassword with an initial value of null or an empty string
  let randomPassword = null;
  if (req.body.bookType === "Fargo - Moorhead (Digital Coupon Book)") {
    // Generate the random password only for digital books
    randomPassword = generatePassword(req.body.firstName, req.body.lastName);
  }

  try {
    const email = req.body.email;
    const apiKey = process.env.AC_API_KEY;
    const checkedResponse = await axios.get(
      `https://northpointeinsure57220.api-us1.com/api/3/contacts?filters[email]=${email}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token": apiKey,
        },
      }
    );
    console.log(
      "Active campaign returner check",
      checkedResponse.data.contacts
    );
    const returnerId =
      checkedResponse.data.contacts && checkedResponse.data.contacts.length > 0
        ? checkedResponse.data.contacts[0].id
        : null;
    console.log(returnerId);

    if (
      checkedResponse.data.message ===
        "No Result found for Subscriber with id 0" ||
      returnerId === null
    ) {
      // code block runs to add a a new contact if there is no contact response from active campaign
      const apiKey = process.env.AC_API_KEY;
      const data = {
        contact: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          email: req.body.email,
          fieldValues: [
            {
              field: "1",
              value: req.body.address,
            },
            {
              field: "2",
              value: req.body.city,
            },
            {
              field: "3",
              value: req.body.state,
            },
            {
              field: "4",
              value: req.body.zip,
            },
            {
              field: "59",
              value: req.body.organization,
            },
            {
              field: "60",
              value: req.body.url,
            },
            {
              field: "63",
              value: req.body.year,
            },
            {
              field: "64",
              value: req.body.email,
            },
            {
              field: "66",
              value: req.body.donation,
            },
            {
              field: "65",
              value: randomPassword,
            },
          ],
        },
      };

      const response1 = await axios.post(
        `https://northpointeinsure57220.api-us1.com/api/3/contacts`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Token": apiKey,
          },
        }
      );
      console.log("Response from ActiveCampaign:", response1.data.contact);
      const contactId = response1.data.contact.id;
      console.log(contactId);

      let list = 10;

      //ADD THIS BACK IN WHEN REGION FILTERING IS ADDED
      //Can add more regions as needed

      // switch (req.body.region) {
      //   case 1:
      //     list = 10;
      //     break;
      //   case 2:
      //     list = 11;
      //     break;
      //   default:
      //     list = 0;
      //     break;
      // }

      const response2 = await axios.post(
        `https://northpointeinsure57220.api-us1.com/api/3/contactLists`,
        JSON.stringify({
          contactList: {
            list: list,
            contact: contactId,
            status: 1,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Token": apiKey,
          },
        }
      );
      console.log("Response from adding contact to list:", response2.data);

      let tag = 0;

      // if (
      //   req.body.bookType === "Physical Coupon Book" &&
      //   req.body.type === "cash"
      // ) {
      //   tag = 58;
      // } else if (
      //   req.body.bookType === "Physical Coupon Book" ||
      //   ("Fargo - Moorhead (Digital Coupon Book)" && req.body.type === "credit")
      // ) {
      //   tag = 56;
      // } else if (req.body.bookType === "Donate") {
      //   tag = 59;
      // } else {
      //   tag = 0;
      // }
      if (
        req.body.bookType === "Physical Coupon Book" &&
        (req.body.type === "cash" || req.body.type === "credit")
      ) {
        tag = 58; // 58 is for PSG: CC Physical Book- Group (Cash & Carry)
      } else if (
        req.body.bookType === "Fargo - Moorhead (Digital Coupon Book)" &&
        req.body.type === "credit"
      ) {
        tag = 56; // 56 is for PSG: CC Digital- Any Group
      } else if (req.body.bookType === "Donate") {
        tag = 59; // 59 is for PSG: CC Donation
      } else {
        tag = 0;
      }

      const response3 = await axios.post(
        `https://northpointeinsure57220.api-us1.com/api/3/contactTags`,
        JSON.stringify({
          contactTag: {
            contact: contactId,
            tag: tag,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Token": apiKey,
          },
        }
      );
      console.log("Response from adding tag to contact:", response3.data);
      res.send(randomPassword);
    } else {
      // Code block to run if there is already a user in the active campaign database, updates existing information and updates the list a user is added to
      const apiKey = process.env.AC_API_KEY;
      const data = {
        contact: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          email: req.body.email,
          fieldValues: [
            {
              field: "1",
              value: req.body.address,
            },
            {
              field: "2",
              value: req.body.city,
            },
            {
              field: "3",
              value: req.body.state,
            },
            {
              field: "4",
              value: req.body.zip,
            },
            {
              field: "59",
              value: req.body.organization,
            },
            {
              field: "60",
              value: req.body.url,
            },
            {
              field: "63",
              value: req.body.year,
            },
            {
              field: "64",
              value: req.body.email,
            },
            {
              field: "66",
              value: req.body.donation,
            },
          ],
        },
      };
      res.send(randomPassword); // Send the password as a response, to register user to the table (if previously missed)

      //Updates current active campaign data
      const response1 = await axios.put(
        `https://northpointeinsure57220.api-us1.com/api/3/contacts/${returnerId}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Token": apiKey,
          },
        }
      );
      console.log("Response from ActiveCampaign:", response1.data);

      var list = 10;

      //ADD THIS BACK IN WHEN REGION FILTERING IS ADDED
      //Can add more regions as needed

      // switch (req.body.region) {
      //   case 1:
      //     list = 10;
      //     break;
      //   case 2:
      //     list = 11;
      //     break;
      //   default:
      //     list = 0;
      //     break;
      // }
      // console.log("returning list type is:", list)

      //Retrieves returning contacts list's and then compairs an lists they are currently subscribed too to either add them to a new list or trigger the automation for the list
      const returnerLists = await axios.get(
        `https://northpointeinsure57220.api-us1.com/api/3/contacts/${returnerId}/contactLists`,
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Token": apiKey,
          },
        }
      );
      const lists = returnerLists.data.contactLists;
      console.log("The lists variable", lists);

      for (let i = 0; i < lists.length; i++) {
        const returnList = lists[i];
        console.log("list in loop", returnList.list);
        console.log("list to be added too", list);
        if (Number(returnList.list) === list) {
          const response2 = await axios.post(
            `https://northpointeinsure57220.api-us1.com/api/3/contactAutomations`,
            JSON.stringify({
              contactAutomation: {
                contact: returnerId,
                automation: "46",
              },
            }),
            {
              headers: {
                "Content-Type": "application/json",
                "Api-Token": apiKey,
              },
            }
          );
          console.log(
            "response from adding contact to automation",
            response2.data
          );
        } else {
          const response2 = await axios.post(
            `https://northpointeinsure57220.api-us1.com/api/3/contactLists`,
            JSON.stringify({
              contactList: {
                list: list,
                contact: returnerId,
                status: 1,
              },
            }),
            {
              headers: {
                "Content-Type": "application/json",
                "Api-Token": apiKey,
              },
            }
          );
          console.log("Response from adding contact to list:", response2.data);
        }
      }

      const response2 = await axios.post(
        `https://northpointeinsure57220.api-us1.com/api/3/contactLists`,
        JSON.stringify({
          contactList: {
            list: list,
            contact: returnerId,
            status: 1,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Token": apiKey,
          },
        }
      );
      console.log("Response from adding contact to list:", response2.data);
      console.log("returning book type is:", req.body.bookType);
      console.log("type is:", req.body.type);
      let tag = 0;

      // if (
      //   req.body.bookType === "Physical Coupon Book" &&
      //   (req.body.type === "cash" || req.body.type === "credit")
      // ) {
      //   tag = 58;
      // } else if (
      //   // req.body.bookType === "Physical Coupon Book" ||
      //   ("Fargo - Moorhead (Digital Coupon Book)" && req.body.type === "credit")
      // ) {
      //   tag = 56;
      // } else if (req.body.bookType === "Donate") {
      //   tag = 59;
      // } else {
      //   tag = 0;
      // }
      if (
        req.body.bookType === "Physical Coupon Book" &&
        (req.body.type === "cash" || req.body.type === "credit")
      ) {
        tag = 58;
      } else if (
        req.body.bookType === "Fargo - Moorhead (Digital Coupon Book)" &&
        req.body.type === "credit"
      ) {
        tag = 56;
      } else if (req.body.bookType === "Donate") {
        tag = 59;
      } else {
        tag = 0;
      }

      const response3 = await axios.post(
        `https://northpointeinsure57220.api-us1.com/api/3/contactTags`,
        JSON.stringify({
          contactTag: {
            contact: returnerId,
            tag: tag,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Token": apiKey,
          },
        }
      );
      console.log(
        "Response from adding tag to a returning contact:",
        response3.data
      );

      res.sendStatus(200);
    }
  } catch (error) {
    console.error("Error sending contact to Active Campaign", error);
    res.sendStatus(500);
  }
});

app.post("/api/recoverPassword", async (req, res) => {
  try {
    const email = req.body.email;
    const apiKey = process.env.AC_API_KEY;
    // const emailChecked = await axios.get(`https://${process.env.ac_address}/api/${process.env.version}/contacts?filters[email]=${email}`,
    const emailChecked = await axios.get(
      `https://northpointeinsure57220.api-us1.com/api/3/contacts?filters[email]=${email}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token": apiKey,
        },
      }
    );
    // console.log("emailChecked from server: ", emailChecked);
    // console.log(emailChecked.data);
    const id =
      emailChecked.data.contacts.length > 0
        ? emailChecked.data.contacts[0].id
        : null;
    // console.log(id);
    const resetAcc = await axios.post(
      // `https://${process.env.ac_address}/api/${process.env.version}/contactTags`,
      `https://northpointeinsure57220.api-us1.com/api/3/contactTags`,
      JSON.stringify({
        contactTag: {
          contact: id,
          tag: 64,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token": apiKey,
        },
      }
    );
    console.log("Response from adding tag to contact:", resetAcc.data);
    res.sendStatus(200);
  } catch (error) {
    console.log("Error adding recover password tag to AC contact", error);
    res.sendStatus(500);
  }
});

// End Active Campaign ~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Listen
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
