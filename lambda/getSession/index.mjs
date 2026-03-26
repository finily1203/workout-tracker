import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        const userId = event.queryStringParameters?.userId || event.userId;
        const sessionId = event.pathParameters?.sessionId || event.sessionId;

        const result = await docClient.send(new GetCommand({
            TableName: "WorkoutSessions",
            Key: { userId, sessionId }
        }));

        if (!result.Item) {
            return {
                statusCode: 404,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "Session not found" })
            };
        }

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ session: result.Item })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message })
        };
    }
};