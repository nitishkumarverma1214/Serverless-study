import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const setPictureUrlToAuction = async (id, pictureUrl) => {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: marshall({ id }),
        UpdateExpression: 'SET pictureUrl = :pictureUrl',
        ExpressionAttributeValues: marshall({
            ":pictureUrl": pictureUrl,
        }),
        ReturnValues: "ALL_NEW",
    };

    const command = new UpdateItemCommand(params);

    const response = await docClient.send(command);
    const updatedAuction = unmarshall(response?.Attributes);
    console.log('addPictureUrl: auction', updatedAuction);
    return updatedAuction;
};
