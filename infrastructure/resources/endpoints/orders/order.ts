import { APIGatewayProxyEvent } from "aws-lambda";
import { getOrderById } from "../../handlers/orders/getOrderById";
import { deleteOrder } from "../../handlers/orders/deleteOrder";

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
        return await getOrderById({ id });
      case "DELETE":
        return await deleteOrder({ id });
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
