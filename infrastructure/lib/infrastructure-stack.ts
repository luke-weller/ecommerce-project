import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  ApiKey,
  ApiKeySourceType,
  Cors,
  LambdaIntegration,
  RestApi,
  UsagePlan,
} from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // create the db tables
    const productsTable = new Table(this, "ProductsTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const ordersTable = new Table(this, "OrdersTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const usersTable = new Table(this, "UsersTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    // create the api gateway
    const api = new RestApi(this, "RestAPI", {
      restApiName: "RestAPI",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    // create the api key
    const apiKey = new ApiKey(this, "ApiKey");

    // create the usage plan
    const usagePlan = new UsagePlan(this, "UsagePlan", {
      name: "Usage Plan",
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
    });

    // add the api key to the usage plan
    usagePlan.addApiKey(apiKey);

    // create the lambda functions
    const productsLambda = new NodejsFunction(this, "ProductsLambda", {
      entry: "resources/endpoints/products/products.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: productsTable.tableName,
      },
    });

    const ordersLambda = new NodejsFunction(this, "OrdersLambda", {
      entry: "resources/endpoints/orders/orders.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: ordersTable.tableName,
      },
    });

    const usersLambda = new NodejsFunction(this, "UsersLambda", {
      entry: "resources/endpoints/users/users.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: usersTable.tableName,
      },
    });

    // Grant read and write access to the `postsLambda` and `postLambda` functions to the `dbTable`
    productsTable.grantReadWriteData(productsLambda);
    ordersTable.grantReadWriteData(ordersLambda);
    usersTable.grantReadWriteData(usersLambda);

    // define the endpoints
    const products = api.root.addResource("products");
    const product = products.addResource("{id}");

    const orders = api.root.addResource("orders");
    const order = orders.addResource("{id}");

    const users = api.root.addResource("users");
    const user = users.addResource("{id}");

    const productsIntegration = new LambdaIntegration(productsLambda);
    const ordersIntegration = new LambdaIntegration(ordersLambda);
    const usersIntegration = new LambdaIntegration(usersLambda);

    // define the methods on the defined endpoints
    products.addMethod("GET", productsIntegration, {
      apiKeyRequired: true,
    });

    products.addMethod("POST", productsIntegration, {
      apiKeyRequired: true,
    });

    product.addMethod("GET", productsIntegration, {
      apiKeyRequired: true,
    });
    product.addMethod("DELETE", productsIntegration, {
      apiKeyRequired: true,
    });

    orders.addMethod("GET", ordersIntegration, {
      apiKeyRequired: true,
    });

    orders.addMethod("POST", ordersIntegration, {
      apiKeyRequired: true,
    });

    order.addMethod("GET", ordersIntegration, {
      apiKeyRequired: true,
    });

    order.addMethod("DELETE", ordersIntegration, {
      apiKeyRequired: true,
    });

    users.addMethod("GET", usersIntegration, {
      apiKeyRequired: true,
    });

    users.addMethod("POST", usersIntegration, {
      apiKeyRequired: true,
    });

    user.addMethod("GET", usersIntegration, {
      apiKeyRequired: true,
    });

    user.addMethod("DELETE", usersIntegration, {
      apiKeyRequired: true,
    });

    // output the api key id
    new CfnOutput(this, "API Key ID", {
      value: apiKey.keyId,
    });
  }
}
