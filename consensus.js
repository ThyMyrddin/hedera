console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  TopicCreateTransaction,
  TopicUpdateTransaction,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
  TopicDeleteTransaction,
} = require("@hashgraph/sdk");

// Grab the OPERATOR_ID and OPERATOR_KEY from the .env file
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

// Build Hedera testnet and mirror node client
const client = Client.forTestnet();

// Set the operator account ID and operator private key
client.setOperator(operatorId, operatorKey);

async function main() {
  //Create a new topic
  
  let txResponse = await new TopicCreateTransaction()
    .setAdminKey(operatorKey)
    .setSubmitKey(operatorKey)
    .setTopicMemo("memo1")
    .execute(client);

  //Grab the newly generated topic ID
  let receipt = await txResponse.getReceipt(client);
  let topicId = receipt.topicId;
  console.log(`Your topic ID is: ${topicId} `);


  const transaction = await new TopicUpdateTransaction()
    .setTopicId(topicId)
    .setTopicMemo("memo2")
    .freezeWith(client);

//Sign the transaction with the admin key to authorize the update
const signTx = await transaction.sign(operatorKey);
    
//Sign with the client operator private key and submit to a Hedera network
const txResponse2 = await signTx.execute(client);

//Request the receipt of the transaction
const receipt2 = await txResponse.getReceipt(client);
console.log(`Your topic ID after updating memo is: ${receipt2.topicId}`);

  // Wait 5 seconds between consensus topic creation and subscription creation
  await new Promise((resolve) => setTimeout(resolve, 5000));

  //Create the query
 new TopicMessageQuery()
    .setTopicId(topicId)
    .subscribe(client, null, (message) => {
      let messageAsString = Buffer.from(message.contents, "utf8").toString();
      console.log(
        `Received: ${messageAsString}`
      );
    });


    // Send one message
    let sendResponse = await new TopicMessageSubmitTransaction({
      topicId: topicId,
      message: "Hello, World!, "
    }).execute(client);


  
}
main();