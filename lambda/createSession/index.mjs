import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const userId = body.userId;
        const sessionId = randomUUID();
        const date = new Date().toISOString().split("T")[0];

        const item = {
            userId,
            sessionId,
            date,
            muscleGroups: body.muscleGroups || [],
            notes: body.notes || "",
            exercises: body.exercises || []
        };

        await docClient.send(new PutCommand({
            TableName: "WorkoutSessions",
            Item: item
        }));

        return {
            statusCode: 201,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Session created", sessionId })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message })
        };
    }
};