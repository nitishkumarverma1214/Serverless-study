import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"; // ES Modules import

// const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const closeAuction = async (auction) => {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { 'id': auction.id },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':status': 'CLOSE',
        },
        UpdateExpression: 'SET #status = :status',
        ReturnValues: "ALL_NEW",
    };
    const command = new UpdateCommand(params);
    const response = await docClient.send(command);
    const closedAuction =  response?.Attributes;

    const sellerMessage = {
        subject:"Auction Closed - Creator",
        body:`The auction ${closedAuction.title} is closed and the highest bid recieved on the auction is: ${closedAuction.highestBid.amount}`,
        recipient: closedAuction?.seller
    };
    const notifySeller =  addMessageToQueue(process.env.MAIL_QUEUE_URL, JSON.stringify(sellerMessage));

    // check for bidder
    let notifyBidder;
    if(closedAuction?.highestBid?.bidder){

        const bidderMessage = {
            subject:"You won the Auction -Bidder ",
            body:`The auction is closed and you won the auction ${closedAuction.title} for: ${closedAuction.highestBid.amount}`,
            recipient: closedAuction?.highestBid?.bidder
        };
        notifyBidder = addMessageToQueue(process.env.MAIL_QUEUE_URL, JSON.stringify(bidderMessage));
    }

    // send the message
    await Promise.all([notifySeller,notifyBidder]);
};


export const addMessageToQueue = async (sqsQueueUrl, messageBody) => {
    const client = new SQSClient({});

    const command = new SendMessageCommand({
      QueueUrl: sqsQueueUrl,
      MessageBody:messageBody,
    });
    const response = await client.send(command);
    console.log(response);
    return response;
  };