import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { Product } from "../../../types";

const dynamodb = new DynamoDB({});

export async function createProduct(body: string | null) {
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
  const bodyParsed = JSON.parse(body) as Product;

  // Ensure the required properties are present
  const { id, name, price, description, category } = bodyParsed;
  if (!id || !name || !price || !description || !category) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing required properties" }),
    };
  }

  // Create the product
  await dynamodb.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        pk: `PRODUCT#${uuid}`,
        id,
        name,
        price,
        description,
        category,
        createdAt,
        updatedAt,
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Product created" }),
  };
}
