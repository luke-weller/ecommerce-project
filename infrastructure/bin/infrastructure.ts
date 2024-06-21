#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
import cdk = require("aws-cdk-lib");
import infrastructure_stack = require("../lib/infrastructure-stack");

const app = new cdk.App();

// Determine the environment from command-line arguments
const environment = app.node.tryGetContext("env") || "test"; // Default to 'test' if not specified

// Configure environment variables based on the selected environment
let envConfig;
if (environment === "test") {
  envConfig = {
    account: process.env.TEST_ACCOUNT,
    region: process.env.TEST_REGION,
  };
} else if (environment === "prod") {
  envConfig = {
    account: process.env.PROD_ACCOUNT,
    region: process.env.PROD_REGION,
  };
}

// Instantiate the InfrastructureStack with the environment-specific configuration
new infrastructure_stack.InfrastructureStack(app, "InfrastructureStack", {
  env: envConfig,
});
