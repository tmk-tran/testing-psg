import React, { useState } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Typography } from "@mui/material";
import { dispatchHook } from "../../hooks/useDispatch";

// Renders errors or successfull transactions on the screen.
function Message({ content }) {
  return <p>{content}</p>;
}

function PayPalButton({
  refId,
  selectedProducts,
  customDonation,
  orderSuccess,
}) {
  // comes through undefined in test environment
  console.log(process.env.REACT_APP_PAYPAL_CLIENT_ID);
  const dispatch = dispatchHook();

  // Removed 'venmo' from "enable-funding"
  const initialOptions = {
    "client-id":
      // "AXW1Fk6t36VzplCt2ev6VRwygaNynFd4tz4KBWicOhfvFrPLenoFFcwIbgih38FpabvP9I6RXFfyZ_Nx",
      "AXw4KZ31SkyY5t_62QfDp4x7pQYm5t1-UfGpGDOOJVXo7Xb0UEdlRPkXW8mhOtVxDJhAY4PSofVyDaFu",
    // process.env.REACT_APP_PAYPAL_CLIENT_ID,
    "enable-funding": "paylater,card",
    "disable-funding": "",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  const [message, setMessage] = useState("");

  return (
    <div className="PayPalButton" style={{ marginTop: "5%", width: "50%" }}>
      <Typography>Please select a payment method:</Typography>

      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
          }}
          // createOrder={async () => {
          //   try {
          //     const requestBody = {
          //       cart: selectedProducts.map((product) => ({
          //         id: product.id,
          //         quantity: product.quantity,
          //       })),
          //     };

          //     console.log("Request Body:", requestBody);

          //     const response = await fetch("/api/orders", {
          //       method: "POST",
          //       headers: {
          //         "Content-Type": "application/json",
          //       },
          //       // use the "body" param to optionally pass additional order information
          //       // like product ids and quantities
          //       // body: JSON.stringify({
          //       //   cart: [
          //       //     {
          //       //       id: "YOUR_PRODUCT_ID",
          //       //       quantity: "YOUR_PRODUCT_QUANTITY",
          //       //     },
          //       //   ],
          //       // }),
          //       body: JSON.stringify(requestBody),
          //     });
          //     console.log(response);

          //     const orderData = await response.json();
          //     console.log(orderData);

          //     if (orderData.id) {
          //       return orderData.id;
          //     } else {
          //       const errorDetail = orderData?.details?.[0];
          //       const errorMessage = errorDetail
          //         ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          //         : JSON.stringify(orderData);

          //       throw new Error(errorMessage);
          //     }
          //   } catch (error) {
          //     console.error(error);
          //     console.log(error);
          //     setMessage(`Could not initiate PayPal Checkout...${error}`);
          //   }
          // }}
          createOrder={async () => {
            try {
              const requestBody = {
                cart: selectedProducts.map((product) => ({
                  id: product.id,
                  quantity: product.quantity,
                  price: product.price,
                })),
              };

              // console.log("Request Body:", requestBody);

              const response = await axios.post("/api/orders", requestBody, {
                headers: {
                  "Content-Type": "application/json",
                },
              });

              // console.log(response);

              const orderData = response.data;
              // console.log(orderData);

              if (orderData.id) {
                return orderData.id;
              } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                  : JSON.stringify(orderData);

                throw new Error(errorMessage);
              }
            } catch (error) {
              console.error(error);
              console.log(error);
              setMessage(`Could not initiate PayPal Checkout...${error}`);
            }
          }}
          // onApprove={async (data, actions) => {
          //   try {
          //     const response = await fetch(
          //       `/api/orders/${data.orderID}/capture`,
          //       {
          //         method: "POST",
          //         headers: {
          //           "Content-Type": "application/json",
          //         },
          //       }
          //     );

          //     const orderData = await response.json();
          //     // Three cases to handle:
          //     //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //     //   (2) Other non-recoverable errors -> Show a failure message
          //     //   (3) Successful transaction -> Show confirmation or thank you message

          //     const errorDetail = orderData?.details?.[0];

          //     if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
          //       // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //       // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
          //       return actions.restart();
          //     } else if (errorDetail) {
          //       // (2) Other non-recoverable errors -> Show a failure message
          //       throw new Error(
          //         `${errorDetail.description} (${orderData.debug_id})`
          //       );
          //     } else {
          //       // (3) Successful transaction -> Show confirmation or thank you message
          //       // Or go to another URL:  actions.redirect('thank_you.html');
          //       const transaction =
          //         orderData.purchase_units[0].payments.captures[0];
          //       setMessage(
          //         `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
          //       );
          //       console.log(
          //         "Capture result",
          //         orderData,
          //         JSON.stringify(orderData, null, 2)
          //       );
          //     }
          //   } catch (error) {
          //     console.error(error);
          //     setMessage(
          //       `Sorry, your transaction could not be processed...${error}`
          //     );
          //   }
          // }}
          onApprove={async (data, actions) => {
            try {
              const response = await axios.post(
                `/api/orders/${data.orderID}/capture`,
                {},
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              const orderData = response.data;
              const errorDetail = orderData?.details?.[0];

              if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                // Recoverable INSTRUMENT_DECLINED
                return actions.restart();
              } else if (errorDetail) {
                // Other non-recoverable errors
                throw new Error(
                  `${errorDetail.description} (${orderData.debug_id})`
                );
              } else {
                // Successful transaction
                const transaction =
                  orderData.purchase_units[0].payments.captures[0];
                setMessage(
                  `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                );
                // console.log(
                //   "Capture result",
                //   orderData,
                //   JSON.stringify(orderData, null, 2)
                // );
                orderSuccess(orderData);

                // Insert transaction data into the transactions table
                const transactionData = {
                  status: orderData.status,
                  payment_source_email:
                    orderData.payment_source.paypal.email_address,
                  payment_source_account_id:
                    orderData.payment_source.paypal.account_id,
                  payment_source_account_status:
                    orderData.payment_source.paypal.account_status,
                  payment_source_name_given_name:
                    orderData.payment_source.paypal.name.given_name,
                  payment_source_name_surname:
                    orderData.payment_source.paypal.name.surname,
                  payment_source_address_country_code:
                    orderData.payment_source.paypal.address.country_code,
                  purchase_units_reference_id:
                    orderData.purchase_units[0].reference_id,
                  purchase_units_shipping_name_full_name:
                    orderData.purchase_units[0].shipping.name.full_name,
                  purchase_units_shipping_address_address_line_1:
                    orderData.purchase_units[0].shipping.address.address_line_1,
                  purchase_units_shipping_address_admin_area_2:
                    orderData.purchase_units[0].shipping.address.admin_area_2,
                  purchase_units_shipping_address_admin_area_1:
                    orderData.purchase_units[0].shipping.address.admin_area_1,
                  purchase_units_shipping_address_postal_code:
                    orderData.purchase_units[0].shipping.address.postal_code,
                  purchase_units_shipping_address_country_code:
                    orderData.purchase_units[0].shipping.address.country_code,
                  purchase_units_payments_captures_id:
                    orderData.purchase_units[0].payments.captures[0].id,
                  purchase_units_payments_captures_status:
                    orderData.purchase_units[0].payments.captures[0].status,
                  purchase_units_payments_captures_amount_currency_code:
                    orderData.purchase_units[0].payments.captures[0].amount
                      .currency_code,
                  purchase_units_payments_captures_amount_value:
                    orderData.purchase_units[0].payments.captures[0].amount
                      .value,
                  purchase_units_payments_captures_create_time:
                    orderData.purchase_units[0].payments.captures[0]
                      .create_time,
                  purchase_units_payments_captures_update_time:
                    orderData.purchase_units[0].payments.captures[0]
                      .update_time,
                  payer_name_given_name: orderData.payer.name.given_name,
                  payer_name_surname: orderData.payer.name.surname,
                  payer_email_address: orderData.payer.email_address,
                  payer_payer_id: orderData.payer.payer_id,
                  payer_address_country_code:
                    orderData.payer.address.country_code,
                  links_href: orderData.links[0].href,
                  links_rel: orderData.links[0].rel,
                  links_method: orderData.links[0].method,
                  seller_receivable_gross_amount_currency_code:
                    orderData.purchase_units[0].payments.captures[0]
                      .seller_receivable_breakdown.gross_amount.currency_code,
                  seller_receivable_gross_amount_value:
                    orderData.purchase_units[0].payments.captures[0]
                      .seller_receivable_breakdown.gross_amount.value,
                  seller_receivable_paypal_fee_currency_code:
                    orderData.purchase_units[0].payments.captures[0]
                      .seller_receivable_breakdown.paypal_fee.currency_code,
                  seller_receivable_paypal_fee_value:
                    orderData.purchase_units[0].payments.captures[0]
                      .seller_receivable_breakdown.paypal_fee.value,
                  seller_receivable_net_amount_currency_code:
                    orderData.purchase_units[0].payments.captures[0]
                      .seller_receivable_breakdown.net_amount.currency_code,
                  seller_receivable_net_amount_value:
                    orderData.purchase_units[0].payments.captures[0]
                      .seller_receivable_breakdown.net_amount.value,
                  seller_ref_id: refId,
                };

                const dispatchAction = {
                  type: "ADD_PAYPAL_TRANSACTION",
                  payload: transactionData,
                };
                dispatch(dispatchAction);
              }
            } catch (error) {
              console.error(error);
              setMessage(
                `Sorry, your transaction could not be processed...${error}`
              );
            }
          }}
        />
      </PayPalScriptProvider>
      <Message content={message} />
    </div>
  );
}

export default PayPalButton;
