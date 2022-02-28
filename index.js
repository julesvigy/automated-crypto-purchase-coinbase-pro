const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config()

var currentTotal = 0;

async function purchase() {
    // 1. Place order
    const orderPrice = await buy();

    // 2. Compute cost of purchase and add to currentTotal
    addToCurrentTotal(orderPrice);
    console.log(currentTotal)

    // 3. Transfer funds if over 10 dollars
    if(currentTotal >= 10){
        await transferFundsFromBank(currentTotal);
        currentTotal = 0;
    }
}

async function buy() {
    const price = await ethPrice();
    const body = JSON.stringify({
        price: price,
        size: '0.001',
        side: 'buy',
        product_id: 'ETH-USD'
    });
    const values = getAuthenticationSignature('POST', '/orders', body)

    return axios.post('https://api.pro.coinbase.com/orders', body, {
        headers: {
            'Content-Type': 'application/json',
            'CB-ACCESS-KEY': process.env.ACCESS_KEY,
            'CB-ACCESS-SIGN': values.signature,
            'CB-ACCESS-TIMESTAMP': values.timestamp,
            'CB-ACCESS-PASSPHRASE': process.env.PASSPHRASE,
        }
    }).then((res) => {
        return res.data.price;
    }).catch((err) => {
        console.log(err.response.data);
    })
}

function addToCurrentTotal(amount) {
    amount = amount * process.env.CRYPTO_AMOUNT // order size hard coded for now
    amount = Math.floor(amount * 100) / 100; // round down to two digits after the decimal
    amount = Number.parseFloat(0.01) + Number.parseFloat(amount); // add one cent
    amount = Number.parseFloat(amount).toFixed(2);
    currentTotal = Number.parseFloat(Number.parseFloat(currentTotal) + Number.parseFloat(amount)).toFixed(2);
}

async function transferFundsFromBank() {
    const body = JSON.stringify({
        amount: currentTotal,
        currency: 'USD',
        payment_method_id: process.env.BANK_ID
    });

    const values = getAuthenticationSignature('POST', '/deposits/payment-method', body);

    axios.post('https://api.pro.coinbase.com/deposits/payment-method', body, {
        headers: {
            'Content-Type': 'application/json',
            'CB-ACCESS-KEY': process.env.ACCESS_KEY,
            'CB-ACCESS-SIGN': values.signature,
            'CB-ACCESS-TIMESTAMP': values.timestamp,
            'CB-ACCESS-PASSPHRASE': process.env.PASSPHRASE,
        }
    }).then((res) => {
        console.log(res.data);
    }).catch((err) => {
        console.log(err.response.data);
    })
}

async function transferEthToCoinbase(){

}

////////////////////////////////HELPERS///////////////////////////////////////
function getAuthenticationSignature(method, requestPath, body) {
    const timestamp = Date.now() / 1000;

    // create the prehash string by concatenating required parts
    const what = timestamp + method + requestPath + body;

    // decode the base64 secret
    const key = Buffer(process.env.SECRET, 'base64');

    // create a sha256 hmac with the secret
    const hmac = crypto.createHmac('sha256', key);

    // sign the require message with the hmac
    // and finally base64 encode the result
    const signature = hmac.update(what).digest('base64');

    return { signature, timestamp }
}

async function ethPrice() {
    return axios.get('https://api.pro.coinbase.com/products/ETH-USD/book')
        .then((res) => {
            return res.data.asks[0][0];
        }).catch((err) => {
            console.log(err.data);
        })
}

const oneMinute = 60000;
const oneHour = 60;
const totalTime = oneMinute * oneHour * process.env.INTERVAL; // computes interval in miliseconds

setInterval(purchase, totalTime);