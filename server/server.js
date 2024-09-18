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
const userOrgAdminRouter = require("./routes/userOrgAdmin.router");
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
app.use("/api/orgadmin", userOrgAdminRouter);
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~ PayPal Section ~~~~~ //
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
// End PayPal Section
// ~~~~~~~~~~~~~~~ //

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~ Active Campaign Section ~~~~~~ //
// Helper to make API requests
async function makeApiRequest(endpoint, method, data = null, apiKey) {
  console.log(
    ` <<< Coming from makeApiRequest in server >>> - making ${method.toUpperCase()} request to endpoint ---> '${endpoint}' --- Data package ---> ${data}`
  );
  // Prepare the config for the axios request
  const config = {
    method,
    url: `https://northpointeinsure57220.api-us1.com/api/3/${endpoint}`,
    headers: {
      "Content-Type": "application/json",
      "Api-Token": apiKey,
    },
  };
  // Handle GET requests (use query parameters)
  if (method.toUpperCase() === "GET" && data) {
    config.params = data; // For GET, pass `data` as query parameters
  } else if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && data) {
    config.data = JSON.stringify(data); // For POST, PUT, PATCH, send `data` in the body
  }

  // Make the API request
  try {
    const response = await axios(config);
    console.log(
      ` <<< Response in makeApiRequest >>> from endpoint ---> '${endpoint}'`
    );
    console.log(" ----- Status >>> ", response.status);
    // console.log(" ----- Data >>> ", response.data);
    return response;
  } catch (error) {
    console.error(`Error making request to '${endpoint}':`, error);
    throw error;
  }
}

// Helper to create the contact data form for Active Campaign
const createContactData = (firstName, lastName, phone, email, fieldValues) => ({
  contact: {
    firstName,
    lastName,
    phone,
    email,
    fieldValues,
  },
});

// Helper to generate field values
function generateFieldValues(reqBody, randomPassword) {
  // console.log("Generating field values for", reqBody);
  const fieldValues = [
    { field: "1", value: reqBody.address },
    { field: "2", value: reqBody.city },
    { field: "3", value: reqBody.state },
    { field: "4", value: reqBody.zip },
    { field: "59", value: reqBody.organization },
    { field: "60", value: reqBody.url },
    { field: "63", value: reqBody.year },
    { field: "64", value: reqBody.email },
    { field: "66", value: reqBody.donation },
  ];
  if (randomPassword) {
    fieldValues.push({ field: "65", value: randomPassword }); // Only for digital books
  }
  return fieldValues;
}

// Handle tag logic
function determineTag(bookType, paymentType) {
  let tag = 0;

  // Check if bookType is an array and handle accordingly
  if (Array.isArray(bookType)) {
    if (
      bookType.includes("Fargo - Moorhead (Digital Coupon Book)") &&
      paymentType === "credit"
    ) {
      tag = 56; // Assign tag 56 ---> for PSG: CC Digital- Any Group
    } else if (
      bookType.includes("Physical Coupon Book") &&
      (paymentType === "cash" || paymentType === "credit")
    ) {
      tag = 58; // Assign tag 58 ---> for PSG: CC Physical Book- Group (Cash & Carry)
    } else if (bookType.includes("Donate") && paymentType === "credit") {
      tag = 59; // Assign tag 59 ---> for PSG: CC Donation
    }
  }

  return tag;
}

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
// If there is already a user in the Active Campaign database, update existing information and update the list a user is added to
async function updateActiveCampaignContact(contactId, contactData, apiKey) {
  const updateResponse = await makeApiRequest(
    `contacts/${contactId}`,
    "put",
    createContactData(contactData),
    apiKey
  );
  console.log(
    "<<< Updated existing contact in Active Campaign >>>:",
    updateResponse.status
  );
}

// Create new contact
async function createNewContact(contactData, apiKey) {
  const createResponse = await makeApiRequest(
    `contacts`,
    "post",
    createContactData(contactData),
    apiKey
  );
  console.log(
    "<<< Created new contact in Active Campaign >>>:",
    createResponse.status
  );
  return createResponse.data.contact.id; // Return the contact ID
}

// Assign a tag to a contact
async function assignTagToContact(contactId, tag, apiKey) {
  const tagPackage = { contactTag: { contact: Number(contactId), tag } };
  const assignTagResponse = await makeApiRequest(
    `contactTags`,
    "post",
    tagPackage,
    apiKey
  );
  console.log("<<< Added tag to contact >>>:", assignTagResponse.status);
}

// Add contact to a list
async function addContactToList(contactId, listId, apiKey) {
  const contactList = {
    contactList: { list: listId, contact: Number(contactId), status: 1 },
  };
  const addToListResponse = await makeApiRequest(
    `contactLists`,
    "post",
    contactList,
    apiKey
  );
  console.log("<<< Added contact to list >>>:", addToListResponse.status);
}

app.post(`/api/contact`, async (req, res) => {
  console.log(
    " <<<<< Received contact request in server for Active Campaign >>>>> req.body = ",
    req.body
  );
  const apiKey = process.env.AC_API_KEY;
  const { email, firstName, lastName, phone, bookType, type } = req.body;

  try {
    // Check if contact already exists in Active Campaign --> GET
    const contactCheckResponse = await makeApiRequest(
      `contacts?filters[email]=${email}`,
      "get",
      null,
      apiKey
    );
    // True if contact already exists
    const contactExists =
      contactCheckResponse.data.contacts &&
      contactCheckResponse.data.contacts.length > 0;
    // Package the response from Active Campaign
    const contactInfoFromActiveCampaign = contactExists
      ? contactCheckResponse.data.contacts[0]
      : null;
    // Assign the ID if contact already exists
    const contactId = contactExists
      ? contactCheckResponse.data.contacts[0].id
      : null;
    console.log(
      " -----> Contact exists:",
      contactExists,
      " -----> Contact ID:",
      contactId
    );
    console.log(
      "Contact info from Active Campaign:",
      contactInfoFromActiveCampaign
    );

    // Generate field values based on the req.body
    let fieldValues = generateFieldValues(req.body);
    console.log(
      "Common field values coming from app.post for Active Campaign ---> ",
      fieldValues
    );

    if (contactExists) {
      // ---------------------------
      // UPDATE THE EXISTING CONTACT
      // ---------------------------
      // console.log(
      //   " ----- Contact exists -----> Response from Active Campaign: ",
      //   contactInfoFromActiveCampaign
      // );
      // // Generate field values based on the req.body
      // const fieldValues = generateFieldValues(req.body);
      // console.log(
      //   "Field values coming from contactData --- if a contact exists in Active Campaign ---> ",
      //   fieldValues
      // );
      // // Create the data package to send to Active Campaign
      // const contactData = createContactData(
      //   firstName,
      //   lastName,
      //   phone,
      //   email,
      //   fieldValues
      // );
      // console.log(
      //   " contactData --- if a contact exists in Active Campaign ---> ",
      //   contactData
      // );
      // If there is already a user in the Active Campaign database, update existing information and update the list a user is added to
      // const updateActiveCampaignContact = await makeApiRequest(
      //   `contacts/${contactId}`,
      //   "put",
      //   contactData,
      //   apiKey
      // );
      // console.log(
      //   " <<< Response from ActiveCampaign (updating existing contact) >>>: ",
      //   updateActiveCampaignContact.status
      // );
      const updateResponse = await updateActiveCampaignContact(
        contactId,
        { firstName, lastName, phone, email, fieldValues },
        apiKey
      );
      console.log(
        " <<< Response from ActiveCampaign (updating existing contact) >>>: ",
        updateResponse.status
      );
      // Send a response back to the client
      return res.status(200).json({
        message: "Contact updated successfully",
      });
    } else {
      // -------------------------------------
      // ADDING NEW CONTACT TO ACTIVE CAMPAIGN
      // -------------------------------------
      console.log(
        " ----- No contact found, proceeding to create a new contact -----> "
      );
      console.log("bookType:", bookType);
      console.log("Is bookType an array?:", Array.isArray(bookType));
      console.log(
        "Does bookType include 'Fargo - Moorhead (Digital Coupon Book)'?:",
        bookType.includes("Fargo - Moorhead (Digital Coupon Book)")
      );

      // Check if bookType is an array and contains the specified value
      if (
        Array.isArray(bookType) &&
        bookType.includes("Fargo - Moorhead (Digital Coupon Book)")
      ) {
        // Generate a random password for the contact if bookType is 'Fargo - Moorhead (Digital Coupon Book)'
        const randomPassword = generatePassword(firstName, lastName);
        // console.log(
        //   "Generated randomPassword for digital book:",
        //   randomPassword
        // );

        // Add the password to the fieldValues array, to send to Active Campaign
        const fieldValuesForNewContact = generateFieldValues(
          req.body,
          randomPassword
        );
        // console.log(
        //   " -----> Adding a new contact -----> fieldValuesForNewContact -----> ",
        //   fieldValuesForNewContact
        // );

        // Create the new contact package to send to Active Campaign
        const newContactData = createContactData(
          firstName,
          lastName,
          req.body.phone,
          email,
          fieldValuesForNewContact
        );
        // console.log(
        //   " -----> Sending package to Active Campaign -----> newContactData -----> ",
        //   newContactData
        // );

        // Create the new contact in Active Campaign
        const createResponse = await makeApiRequest(
          `contacts`,
          "post",
          newContactData,
          apiKey
        );
        // console.log(
        //   " -----> Response from ActiveCampaign (creating new contact): ",
        //   createResponse.data.contact
        // );

        // ------------------------------------------------------------------------------------
        // Determine the tag to be added to the contact based on the book type and payment type
        // ------------------------------------------------------------------------------------
        const tag = determineTag(bookType, type);
        // console.log(" <<< Tag to be added to the contact >>> -----> ", tag);

        // Package to send Active Campaign
        const tagPackage = {
          contactTag: {
            contact: Number(createResponse.data.contact.id),
            tag: tag,
          },
        };

        // Add the tag to the contact in Active Campaign
        const assignTag = await makeApiRequest(
          `contactTags`,
          "post",
          tagPackage,
          apiKey
        );
        console.log(
          " <<< Response from adding tag to contact >>>:",
          assignTag.status,
          " -----> ",
          assignTag.statusText
        );
        // console.log(
        //   " ----- Tag data added to Active Campaign: ",
        //   assignTag.data
        // );

        // -------------------------------------------------------
        // Add the contact to the relevant list in Active Campaign
        // -------------------------------------------------------
        // The variable 'list' will have to be set depending on the book year
        //  - As of September 2024, list = 10 is for 2024-2025 book year
        let list = 10;
        // Package to send to Active Campaign
        const contactList = {
          contactList: {
            list: list,
            contact: Number(createResponse.data.contact.id),
            status: 1,
          },
        };
        // console.log(
        //   " -----> Adding contact to list --- contactList contains: ",
        //   contactList
        // );

        // Send the package, add the contact to the relevant list in Active Campaign
        const addContactToList = await makeApiRequest(
          `contactLists`,
          "post",
          contactList,
          apiKey
        );
        // console.log(
        //   " <<< Response from adding contact to list >>>:",
        //   addContactToList.data
        // );
        console.log(
          ` <<< Response from adding contact to list >>>: ${addContactToList.status} -----> ${addContactToList.statusText}`
        );

        // ----------------------------
        // Send response back to client
        // ----------------------------
        return res.status(201).json({
          message: "Contact created successfully",
          password: randomPassword,
        });
      } else {
        // -----------------------------------------------------------
        // ADD NEW CONTACT TO ACTIVE CAMPAIGN (no digital book)
        // -----------------------------------------------------------
        // Generate field values based on the req.body
        const fieldValuesForNewContact = generateFieldValues(req.body);
        // Create the new contact package to send to Active Campaign
        const newContactData = createContactData(
          firstName,
          lastName,
          req.body.phone,
          email,
          fieldValuesForNewContact
        );
        // Create the new contact in Active Campaign
        const createResponse = await makeApiRequest(
          `contacts`,
          "post",
          newContactData,
          apiKey
        );
        // ------------------------------------------------------------------------------------
        // Determine the tag to be added to the contact based on the book type and payment type
        // ------------------------------------------------------------------------------------
        const tag = determineTag(bookType, type);
        // Package to send Active Campaign
        const tagPackage = {
          contactTag: {
            contact: Number(createResponse.data.contact.id),
            tag: tag,
          },
        };
        // Add the tag to the contact in Active Campaign
        const assignTag = await makeApiRequest(
          `contactTags`,
          "post",
          tagPackage,
          apiKey
        );
        console.log(
          " <<< Response from adding tag to contact >>>:",
          assignTag.status,
          " -----> ",
          assignTag.statusText
        );
        // -------------------------------------------------------
        // Add the contact to the relevant list in Active Campaign
        // -------------------------------------------------------
        // The variable 'list' will have to be set depending on the book year
        //  - As of September 2024, list = 10 is for 2024-2025 book year
        let list = 10;
        // Package to send to Active Campaign
        const contactList = {
          contactList: {
            list: list,
            contact: Number(createResponse.data.contact.id),
            status: 1,
          },
        };
        // Send the package, add the contact to the relevant list in Active Campaign
        const addContactToList = await makeApiRequest(
          `contactLists`,
          "post",
          contactList,
          apiKey
        );
        console.log(
          ` <<< Response from adding contact to list >>>: ${addContactToList.status} -----> ${addContactToList.statusText}`
        );
        // ----------------------------
        // Send response back to client
        // ----------------------------
        return res.status(201).json({
          message: "Contact created successfully",
        });
      }
    }
  } catch (error) {
    console.log("Error sending contact to ActiveCampaign:", error);
    res.status(500).json({ message: "Error checking or updating contact" });
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
// End Active Campaign
// ~~~~~~~~~~~~~~~~ //

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Listen
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
