import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { Order, Product } from "../../../types";

const dynamodb = new DynamoDB({});

export async function createOrder(body: string | null) {
  const uuid = randomUUID();
  const createdAt = new Date().toISOString();

  // If no body, return an error
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing body" }),
    };
  }

  // Parse the body
  const bodyParsed = JSON.parse(body) as Order;

  // Validate the order properties
  if (!isValidOrder(bodyParsed)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid order" }),
    };
  }

  // Create the order
  await dynamodb.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        pk: `ORDER#${uuid}`,
        ...bodyParsed,
        createdAt,
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Order created" }),
  };
}

function isValidOrder(order: Order): boolean {
  return (
    typeof order.id === "string" &&
    typeof order.userId === "string" &&
    Array.isArray(order.products) &&
    order.products.every((product) => isValidProduct(product)) &&
    typeof order.total === "number" &&
    order.date instanceof Date &&
    order.createdAt instanceof Date &&
    order.updatedAt instanceof Date
  );
}

function isValidProduct(product: Product): boolean {
  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.price === "number"
  );
}
