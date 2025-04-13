// require('dotenv').config();

// const uniqid = require("uniqid");
// const sha256 = require("sha256");
// const axios = require("axios");
// const crypto = require("crypto");


// const PHONE_PAY_HOST_URL = process.env.PHONE_PAY_HOST_URL;
// const MERCHANT_ID = process.env.MERCHANT_ID;
// const SALT_INDEX = process.env.SALT_INDEX;
// const SALT_KEY = process.env.SALT_KEY;
// const REACT_APP_FRONTEND_URL=process.env.REACT_APP_FRONTEND_URL
// const BACKEND_URL=process.env.BACKEND_URL

// const payEndpoint = "/pg/v1/pay";
// const statusEndpoint = "/pg/v1/status";

// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY.padEnd(32, '0')
// const IV_LENGTH = 16;

// function encrypt(text) {
//   let iv = crypto.randomBytes(IV_LENGTH);
//   let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
//   let encrypted = cipher.update(text);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);
//   return iv.toString("hex") + ":" + encrypted.toString("hex");
// }

// exports.pay = async (req, res) => {
//   const { amount, mobileNumber, userId } = req.body;
//   try {
//     const merchantTransactionId = uniqid();
//     const payload = {
//       merchantId: MERCHANT_ID,
//       merchantTransactionId: merchantTransactionId,
//       merchantUserId: userId,
//       amount: amount,
//       redirectUrl: `${BACKEND_URL}/api/redirect-url/${merchantTransactionId}`,
//       redirectMode: "POST",
//       mobileNumber: mobileNumber,
//       paymentInstrument: {
//         type: "PAY_PAGE",
//       },
//     };
//     const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
//     const base64EncodedPayload = bufferObj.toString("base64");
//     const xVerify =sha256(base64EncodedPayload + payEndpoint + SALT_KEY) +"###" +SALT_INDEX;

//     const options = {
//       method: "post",
//       url: `${PHONE_PAY_HOST_URL}${payEndpoint}`,
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-VERIFY": xVerify,
//       },
//       data: {
//         request: base64EncodedPayload,
//       },
//     };

//     axios
//       .request(options)
//       .then((response) => {
//         const url = response.data.data.instrumentResponse.redirectInfo;
//         // res.redirect(url)
//         return res.status(200).json(url);
//         // res.send(url)
//       })
//       .catch((error) => {
//         console.error("Error during payment request:", error);
//       });
//   } catch (error) {
//     console.error("there is some error:", error);
//   }
// };

// exports.redirect = async (req, res) => {
//   const merchantTransactionId = req.params.merchantTransactionId;

//   if (merchantTransactionId) {
//     const xVerify =sha256(`/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY) +"###"+SALT_INDEX;
//     const options = {
//       method: "get",
//       url: `${PHONE_PAY_HOST_URL}${statusEndpoint}/${MERCHANT_ID}/${merchantTransactionId}`,
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-MERCHANT-ID": merchantTransactionId,
//         "X-VERIFY": xVerify,
//       },
//     };

//     try {
//       const response = await axios.request(options);

//       if (response.data) {
        
//         const encryptedPaymentDetails = encrypt(JSON.stringify(response.data));
//         return res.redirect(`${REACT_APP_FRONTEND_URL}/checkout?paymentDetails=${encryptedPaymentDetails}`);
//       }
//     } 
//     catch (error) {
//       console.error("Error during transaction status fetch:", error);
//       return res.redirect(`${REACT_APP_FRONTEND_URL}/checkout`);
//     }
//   } else {
//     res.send("no id found");
//   }
// };



require('dotenv').config();
const axios = require('axios');
const generateAccessToken = require('../utils/AccessTokenGenerator');

// Function to generate a shorter merchantOrderId
const generateMerchantOrderId = () => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4 digit random number
  return `ORD${timestamp}${random}`; // Format: ORD + timestamp + random
};

// Function to complete payment
const complete_payment = async (accessToken, mobileNumber, amount, merchantOrderId, userId) => {
  try {
    const paymentResponse = await axios.post(`${process.env.CREATE_PAYMENT_URL}${process.env.CREATE_PAYMENT_ENDPOINT}`, {
      "merchantOrderId": merchantOrderId,
      "amount": amount,
      "expireAfter": 1200,
      "metaInfo": {
        "udf1": `userId:${userId}`,
        "udf2": `mobileNumber:${mobileNumber}`,
        "udf3": `merchantOrderId:${merchantOrderId}`,
        "udf4": "additional-information-4",
        "udf5": "additional-information-5"
      },
      "paymentFlow": {
        "type": "PG_CHECKOUT",
        "message": "Payment message used for collect requests",
        "merchantUrls": {
          "redirectUrl": `${process.env.REACT_APP_FRONTEND_URL}/checkout?merchantOrderId=${merchantOrderId}`
        }
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`
      }
    });

    const redirectUrl = paymentResponse.data.redirectUrl;
    console.log('Payment redirect URL:', redirectUrl);

    return {
      status: paymentResponse.status,
      orderId:paymentResponse.orderId,
      redirectUrl: redirectUrl,
      merchantOrderId:merchantOrderId
    };
  } catch (error) {
    console.error('Error in complete_payment:', error.response?.data || error.message);
    throw error;
  }
};

exports.pay= async (req, res) => {
  try {
    const { amount, mobileNumber, userId } = req.body;
    const merchantOrderId = generateMerchantOrderId();

    // Get access token using the new function
    const tokenResult = await generateAccessToken();
    if (!tokenResult.success) {
      throw new Error(tokenResult.error);
    }
    const accessToken = tokenResult.accessToken;

    // Call complete_payment function
    const paymentResponse = await complete_payment(
      accessToken,
      mobileNumber,
      amount,
      merchantOrderId,
      userId
    );

    res.status(200).json({ 
      success: true,
      redirectUrl: paymentResponse.redirectUrl,
      merchantOrderId:paymentResponse.merchantOrderId
    });

  } catch (error) {
    console.error('Error processing payment:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.response?.data || error.message
    });
  }
};


exports.checkPaymentStatus=async(req, res) => {
    const { merchantOrderId } = req.body;

    const tokenResult = await generateAccessToken();
    if (!tokenResult.success) {
      throw new Error(tokenResult.error);
    }
    const accessToken = tokenResult.accessToken;

  
    const response = await axios.get(
      `${process.env.CHECK_PAYMENT_URL}${process.env.CHECK_PAYMENT_ENDPOINT_1}/${merchantOrderId}${process.env.CHECK_PAYMENT_ENDPOINT_2}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `O-Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data)
  
    const status = response.data; // like COMPLETED or FAILED
    res.json({ status });
};
