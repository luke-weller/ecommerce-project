import { APIGatewayProxyEvent } from "aws-lambda";
import { getAllOrders } from "../../handlers/orders/getAllOrders";
import { createOrder } from "../../handlers/orders/createOrder";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    // Handle different HTTP methods
    switch (event.httpMethod) {
      case "GET":
        return await getAllOrders();
      case "POST":
        return await createOrder(event.body);
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
