import { APIGatewayProxyEvent } from "aws-lambda";
import { getAllUsers } from "../../handlers/users/getAllUsers";
import { createUser } from "../../handlers/users/createUser";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    // Handle different HTTP methods
    switch (event.httpMethod) {
      case "GET":
        return await getAllUsers();
      case "POST":
        return await createUser(event.body);
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
