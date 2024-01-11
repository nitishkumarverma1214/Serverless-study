import { v4 as uuid } from 'uuid';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from '../lib/commonMiddleware';
import createHttpError from 'http-errors';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const createAcution = async (event, context) => {

  try {
    const { title } = event.body;
    const email  = event.requestContext.authorizer[`${process.env.API_URL}/email`];

    console.log({name:'createAuction', email});
    console.log({name:'createAuction', 'authorizer' :event.requestContext.authorizer});

    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours()+ 1);

    const auction = {
      id: uuid(),
      title,
      status: 'OPEN',
      createdAt: now.toISOString(),
      endingAt: endDate.toISOString(),
      highestBid: {
        amount: 0,
      },
      seller: email
    };

    console.log('createAcution: auction object', auction);

    const input = {
      "TableName": process.env.AUCTIONS_TABLE_NAME,
      "Item": auction
    };

    const command = new PutCommand(input);
    const response = await docClient.send(command);

    console.log('createAuction: db response', response);

    return {
      statusCode: 201,
      body: JSON.stringify(
        { auction },
        null,
        2
      ),
    };

  } catch (error) {
    console.error('createAuction: Error: ', error);

    throw new createHttpError.InternalServerError(error);
  }

};


export const handler = commonMiddleware(createAcution);
