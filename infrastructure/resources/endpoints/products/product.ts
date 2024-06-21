// ./resources/endpoints/post.ts

import { APIGatewayProxyEvent } from "aws-lambda";
import { getProductById } from "../../handlers/products/getProductById";
import { deleteProduct } from "../../handlers/products/deleteProduct";

export const handler = async (event: APIGatewayProxyEvent) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing path parameter: id" }),
    };
  }

  try {
    // Handle different HTTP methods
    switch (event.httpMethod) {
      case "GET":
        return await getProductById({ id });
      case "DELETE":
        return await deleteProduct({ id });
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
