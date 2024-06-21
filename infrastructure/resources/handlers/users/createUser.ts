import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { User } from "../../../types";

const dynamodb = new DynamoDB({});

export async function createUser(body: string | null) {
  const uuid = randomUUID();
  const createdAt = new Date().toISOString();
  const updatedAt = null;

  // If no body, return an error
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing body" }),
    };
  }

  // Parse the body
  const bodyParsed = JSON.parse(body) as User;

  // Ensure the required properties are present
  if (
    !bodyParsed.id ||
    !bodyParsed.name ||
    !bodyParsed.email ||
    !bodyParsed.password
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing required properties" }),
    };
  }

  // Create the user
  await dynamodb.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        pk: `USER#${uuid}`,
        ...bodyParsed,
        createdAt,
        updatedAt,
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "User created" }),
  };
}
