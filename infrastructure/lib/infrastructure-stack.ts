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

    // create the db table
    const dbTable = new Table(this, "DbTable", {
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
      entry: "resources/endpoints/products.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    // Grant read and write access to the `postsLambda` and `postLambda` functions to the `dbTable`
    dbTable.grantReadWriteData(productsLambda);

    // define the endpoints
    const products = api.root.addResource("products");
    const product = products.addResource("{id}");

    const productsIntegration = new LambdaIntegration(productsLambda);

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

    // output the api key id
    new CfnOutput(this, "API Key ID", {
      value: apiKey.keyId,
    });
  }
}
