// ./resources/endpoints/posts.ts

import { APIGatewayProxyEvent } from "aws-lambda";
import { getAllProducts } from "../handlers/products/getAllProducts";
import { createProduct } from "../handlers/products/createProduct";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    // Handle different HTTP methods
    switch (event.httpMethod) {
      case "GET":
        return await getAllProducts();
      case "POST":
        return await createProduct(event.body);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid HTTP method" }),
        };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
