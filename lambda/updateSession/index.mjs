import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body || JSON.stringify(event));
        const { userId, sessionId, exercises, notes, muscleGroups } = body;

        await docClient.send(new UpdateCommand({
            TableName: "WorkoutSessions",
            Key: { userId, sessionId },
            UpdateExpression: "SET exercises = :ex, notes = :n, muscleGroups = :mg",
            ExpressionAttributeValues: {
                ":ex": exercises,
                ":n": notes,
                ":mg": muscleGroups
            }
        }));

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Session updated" })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message })
        };
    }
};