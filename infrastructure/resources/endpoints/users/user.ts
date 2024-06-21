import { APIGatewayProxyEvent } from "aws-lambda";
import { getUserById } from "../../handlers/users/getUserById";
import { deleteUser } from "../../handlers/users/deleteUser";

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
        return await getUserById({ id });
      case "DELETE":
        return await deleteUser({ id });
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
