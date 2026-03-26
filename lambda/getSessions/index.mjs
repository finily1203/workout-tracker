import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        const userId = event.queryStringParameters?.userId || event.userId;

        const result = await docClient.send(new QueryCommand({
            TableName: "WorkoutSessions",
            KeyConditionExpression: "userId = :uid",
            ExpressionAttributeValues: { ":uid": userId }
        }));

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ sessions: result.Items })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message })
        };
    }
};