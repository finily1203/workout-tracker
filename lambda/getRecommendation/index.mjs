import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body || JSON.stringify(event));
        const { userId } = body;

        const result = await docClient.send(new QueryCommand({
            TableName: "WorkoutSessions",
            KeyConditionExpression: "userId = :uid",
            ExpressionAttributeValues: { ":uid": userId },
            Limit: 5,
            ScanIndexForward: false
        }));

        const sessions = result.Items || [];

        const sessionSummary = sessions.map(s =>
            `Date: ${s.date}, Muscle Groups: ${(s.muscleGroups || []).join(", ")}, Exercises: ${
                (s.exercises || []).map(ex =>
                    `${ex.name} (${(ex.sets || []).map(set => `${set.reps} reps @ ${set.weight}kg`).join(", ")})`
                ).join("; ")
            }`
        ).join("\n");

        const prompt = `You are a personal fitness coach. Based on the following recent workout history, suggest the next workout session including which muscle groups to train, specific exercises, sets, reps and weight recommendations. Keep it concise and practical.

Recent workout history:
${sessionSummary}

Provide a structured recommendation for the next workout.`;

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500
            })
        });

        const groqData = await groqResponse.json();
        const recommendation = groqData.choices?.[0]?.message?.content || "No recommendation available.";

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ recommendation })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message })
        };
    }
};