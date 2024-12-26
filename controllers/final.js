const uniqid=require('uniqid')
const sha256=require('sha256')
const axios=require('axios')

const PHONE_PAY_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const MERCHANT_ID = "PGTESTPAYUAT86";
const SALT_INDEX = 1;
const SALT_KEY = "96434309-7796-489d-8924-ab56988a6076";

const payEndpoint = "/pg/v1/pay";
const statusEndpoint="/pg/v1/status"

exports.pay = async (req, res) => {
  const {amount}=req.body
  try {
    const merchantTransactionId=uniqid();
    const payload = {
        "merchantId": MERCHANT_ID,
        "merchantTransactionId": merchantTransactionId,
        "merchantUserId": "1234",
        "amount": amount*100,
        "redirectUrl": `http://localhost:3000/api/redirect-url/${merchantTransactionId}`,
        "redirectMode": "REDIRECT",
        "mobileNumber": "9999999999",
        "paymentInstrument": {
            "type": "PAY_PAGE"
        }
    };
    const bufferObj = Buffer.from(JSON.stringify(payload),"utf8")
    const base64EncodedPayload=bufferObj.toString("base64")
    const xVerify=sha256(base64EncodedPayload+payEndpoint+SALT_KEY)+"###"+SALT_INDEX;

    const options = {
      method: "post",
      url:`${PHONE_PAY_HOST_URL}${payEndpoint}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY":xVerify
      },
      data: {
        request:base64EncodedPayload
      },
    };
    
    axios.request(options)
      .then((response) => {
        const url=response.data.data.instrumentResponse.redirectInfo;
        // res.redirect(url)
        return res.status(200).json(url)
        // res.send(url)
        
      })
      .catch((error) => {
        console.error("Error during payment request:", error);
      });
   
  } catch (error) {
    console.error("there is some error:", error);
  }
};

exports.redirect=async(req,res)=>{
    const merchantTransactionId=req.params.merchantTransactionId
    
    if(merchantTransactionId){
        const xVerify=sha256(`/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + SALT_KEY)+"###"+SALT_INDEX
        const options = {
            method: 'get',
            url: `${PHONE_PAY_HOST_URL}${statusEndpoint}/${MERCHANT_ID}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-MERCHANT-ID':merchantTransactionId,
                'X-VERIFY':xVerify
                },
          
          };
          axios.request(options).then(function (response) {
                console.log(response.data);
                res.send(response.data)
            })
            .catch(function (error) {
              console.error(error);
            });
    }
    else{
        res.send("no id found")
    }

}




///////

 // axios.request(options).then(async (response) => {
    //   if (response.data.success === true) {
    //     let url = "http://localhost:3001/payment/success";
    //     console.log(response.data);
    //     return res.redirect(url);
    //   } else {
    //     let url = "http://localhost:3001/payment/failure";
    //     console.log(response.data);
    //     return res.redirect(url);
    //   }
    // });