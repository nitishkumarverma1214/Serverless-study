import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../lib/commonMiddleware";
import createHttpError from 'http-errors';

const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getAcutionById  = async (id) => {

    let auction;
    try {
        const params = {
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: marshall({ id })
          };

        const command = new GetItemCommand(params);
        const response = await docClient.send(command);
        auction = unmarshall(response?.Item);

        console.log('getAcution: auction', auction);

    } catch (error) {
        console.error('getAuction: Error: ', error);
        throw new createHttpError.InternalServerError(error);
    }

    if(!auction){
        throw new createHttpError.NotFound(`Auction with id ${id} not found`);
    }

    return auction;
};

const getAcution = async (event, context) => {

    const { id } = event.pathParameters;
    let auction = await getAcutionById(id);
    return {
        statusCode: 200,
        body: JSON.stringify(
            { auction },
            null,
            2
        ),
    };

};


export const handler = commonMiddleware(getAcution);