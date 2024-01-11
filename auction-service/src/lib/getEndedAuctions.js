import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getEndedAuctions = async () => {
    const now = new Date();
    let expiredAuctions;
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: marshall({
            ':status': 'OPEN',
            ':now': now.toISOString()
        }),
        KeyConditionExpression:
            '#status = :status AND endingAt <= :now',
    };
    const command = new QueryCommand(params);
    const response = await docClient.send(command);
    console.log('getEndedAuctions:', JSON.stringify(response?.Items));
    expiredAuctions = response?.Items?.map(item => unmarshall(item));
    return expiredAuctions;
};
