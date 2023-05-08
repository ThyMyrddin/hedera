const {
    Client,
    PrivateKey,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar,
  } = require("@hashgraph/sdk");
  require("dotenv").config();
  
  async function main() {
    // Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;
  
    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null || myPrivateKey == null) {
      throw new Error(
        "Environment variables myAccountId and myPrivateKey must be present"
      );
    }
  
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();
  
    client.setOperator(myAccountId, myPrivateKey);
  
    // Create new keys
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
  
    // Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
      .setKey(newAccountPublicKey)
      .setInitialBalance(Hbar.fromTinybars(1000))
      .execute(client);
  
    // Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;
  
    console.log("The new account ID is: " + newAccountId);
  

        // Create new keys
        const new2AccountPrivateKey = PrivateKey.generateED25519();
        const new2AccountPublicKey = newAccountPrivateKey.publicKey;
      
        // Create a new account with 1,000 tinybar starting balance
        const new2Account = await new AccountCreateTransaction()
          .setKey(new2AccountPublicKey)
          .setInitialBalance(Hbar.fromTinybars(1000))
          .execute(client);
      
        // Get the new account ID
        const get2Receipt = await new2Account.getReceipt(client);
        const new2AccountId = get2Receipt.accountId;
      
        console.log("The new account ID is: " + new2AccountId);
      


  }
  
  // Call the async main function
  main();
  