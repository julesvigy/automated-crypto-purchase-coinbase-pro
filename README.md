# automated-crypto-purchase-coinbase-pro
# WARNING!
The automated-crypto-purchase-coinbase-pro is a script that allows you to buy crypto currencies using the Coinbase Pro API on a set interval. That being said you should not directly use it rather use it to help with setting up your own script to make automated crypto purchases. I recommned running this script to make calls to the  Coinbase [sandbox](https://docs.cloud.coinbase.com/exchange/docs/sandbox) account to get a feel how the API works.

## How to Run Script:

1. Create .env file in the root directory of the project.
    - Add the following to the .env file:

```
ACCESS_KEY=
BANK_ID=
PASSPHRASE=
SECRET=
CRYPTO_AMOUNT=
INTERVAL=
COIN_USD=
ORDER_SIZE=
```

2. What each .env value means:
    - ACCESS_KEY: Your Coinbase Pro API access key.
    - BANK_ID: Your bank account id.
    - PASSPHRASE: Your Coinbase Pro API passphrase.
    - SECRET: Your Coinbase Pro API secret.
    - CRYPTO_AMOUNT: The amount of crypto you want to buy.
    - INTERVAL: The interval in seconds you want to buy your crypto.
    - COIN_USD: The crypto pair you want to buy.
    - ORDER_SIZE: The size of the order you want to buy your crypto.


3. Running the script:
    - Run the script using the following commands:
    1. `cd <path-to-script>`
    2. `npm i`
    3. `node index.js`

4. To stop the script:
    - Run the script using the following commands:
    1. `cd <path-to-script>`
    2. `node index.js stop`

**NOTE:** I hope this helps you get started with the Coinbase Pro API if it does give the repo a like. If you have any questions or comments feel free to message me on github and give me a follow.
