import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../lib/commonMiddleware";
import createHttpError from 'http-errors';
import { getAcutionById } from "./getAuction";

const { marshall  } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const placeBid = async (event, context) => {
    let updatedAuction;
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const email  = event.requestContext.authorizer[`${process.env.API_URL}/email`];

    if(!id || !amount){
        throw new createHttpError.BadRequest();
    }

    const existingAuction =  await getAcutionById(id);

    // Auction status validation
    if(existingAuction.status !== 'OPEN'){
        throw new createHttpError.Forbidden(`You can't place a bid on closed auction.`);
    }

    // bidder identity validation
    if(existingAuction.seller === email){
        throw new createHttpError.Forbidden(`You can't place a bid on your own auction.`);
    }

    // avoid duplicate bidding
    if(existingAuction.highestBid.bidder === email){
        throw new createHttpError.Forbidden(`You already have the highest bid on the auction.`);
    }

    // auction amount validation
    if(+existingAuction.highestBid.amount > +amount){
        throw new createHttpError.BadRequest(`Bid amount should be greater than ${existingAuction.highestBid.amount}`);
    }
    try {
        const params = {
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: marshall({ id }),
            UpdateExpression: 'SET highestBid.amount = :amount, highestBid.bidder = :bidder',
            ExpressionAttributeValues: marshall({
                ":amount": amount,
                ":bidder": email
              }),
            ReturnValues: "ALL_NEW",
          };

        const command = new UpdateItemCommand(params);

        console.log('placeBid: command', JSON.stringify(command));
        const response = await docClient.send(command);
        console.log('placeBid: response', JSON.stringify(response));
        updatedAuction = response?.Attributes;

        console.log('placeBid: auction', updatedAuction);

    } catch (error) {
        console.error('placeBid: Error: ', error);

        throw new createHttpError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(
            { auction: updatedAuction },
            null,
            2
        ),
    };

};


export const handler = commonMiddleware(placeBid);