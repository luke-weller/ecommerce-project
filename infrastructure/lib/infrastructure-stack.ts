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
    const postsLambda = new NodejsFunction(this, "PostsLambda", {
      entry: "resources/endpoints/posts.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    const postLambda = new NodejsFunction(this, "PostLambda", {
      entry: "resources/endpoints/post.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    // Grant read and write access to the `postsLambda` and `postLambda` functions to the `dbTable`
    dbTable.grantReadWriteData(postsLambda);
    dbTable.grantReadWriteData(postLambda);

    // define the endpoints
    const posts = api.root.addResource("posts");
    const post = posts.addResource("{id}");

    const postsIntegration = new LambdaIntegration(postsLambda);
    const postIntegration = new LambdaIntegration(postLambda);

    // define the methods on the defined endpoints
    posts.addMethod("GET", postsIntegration, {
      apiKeyRequired: true,
    });
    posts.addMethod("POST", postsIntegration, {
      apiKeyRequired: true,
    });

    post.addMethod("GET", postIntegration, {
      apiKeyRequired: true,
    });
    post.addMethod("DELETE", postIntegration, {
      apiKeyRequired: true,
    });

    // output the api key id
    new CfnOutput(this, "API Key ID", {
      value: apiKey.keyId,
    });
  }
}
