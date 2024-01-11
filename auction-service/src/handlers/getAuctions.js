import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import commonMiddleware from "../lib/commonMiddleware";
import createHttpError from 'http-errors';
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
import validator from '@middy/validator';
import getAuctionsSchema from "../lib/schemas/getAuctionsSchema";
import { transpileSchema } from '@middy/validator/transpile';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const getAcutions = async (event, context) => {

    try {
        let auctions;
        const { status } = event.queryStringParameters;
        const command = new QueryCommand({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            IndexName: 'statusAndEndDate',
            ExpressionAttributeNames: {
                '#status': 'status',
            },
            ExpressionAttributeValues: marshall({
                ':status': status.toUpperCase(),
            }),
            KeyConditionExpression: '#status = :status',
        });
        const response = await docClient.send(command);

        auctions = response?.Items.map(item => unmarshall(item));

        console.log('getAcutions: actions list', auctions);

        return {
            statusCode: 200,
            body: JSON.stringify(
                { auctions },
                null,
                2
            ),
        };

    } catch (error) {
        console.error('getAuctions: Error: ', error);

        throw new createHttpError.InternalServerError(error);
    }

};

const ajvOptions = {
    useDefaults: true,
    strict: false,
};
export const handler = commonMiddleware(getAcutions).use(validator({
    eventSchema: transpileSchema(getAuctionsSchema, ajvOptions)
}));