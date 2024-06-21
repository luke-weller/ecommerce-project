// Import aws-sdk-mock and AWS SDK
import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
// Import the handler you're testing
import { createOrder } from "~/../infrastructure/resources/handlers/orders/createOrder";

// Clear and setup mocks before/after each test
beforeEach(() => {
  AWSMock.restore(); // Restore the mock to its initial state
});

afterAll(() => {
  AWSMock.restore(); // Ensure mocks are cleared after all tests
});

describe("createOrder Lambda Function", () => {
  it("successfully creates an order", async () => {
    // Mock DynamoDB put operation
    AWSMock.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(null, {
        Attributes: { orderId: "123", product: "Product XYZ", quantity: 1 },
      });
    });

    // Define a mock event
    const event = {
      body: JSON.stringify({ product: "Product XYZ", quantity: 1 }),
    };

    // Call the handler with the mock event's body and an empty context
    const result = await createOrder(event.body);

    // Define your expectations for the test result
    expect(result.statusCode).toEqual(200);
    expect(result.body).toContain("orderId");
    // Add more assertions as needed
  });

  // Add more tests for different scenarios, e.g., handling errors, invalid input, etc.
});
