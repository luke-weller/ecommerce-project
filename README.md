# e-Commerce Project

A basic e-commerce project showcasing my work as an example for employers. This project demonstrates the implementation of essential features and functionalities required for an e-commerce platform. Follow the instructions below to set it up locally and deploy resources to AWS.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Development Workflow](#development-workflow)

## Prerequisites

Before setting up the e-commerce project, make sure you have the following prerequisites:

1. An AWS account: If you don't have an AWS account, you can create one [here](https://aws.amazon.com/).
2. AWS CLI: Install the AWS Command Line Interface (CLI) by following the instructions in the [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).
3. Docker: Download and install Docker from the official website [here](https://www.docker.com/get-started).
4. Clone the project

   ```
   git clone https://github.com/your-username/ecommerce-project.git
   ```

## Installation

### Setting up the project infrastructure

To set up the e-commerce project locally and deploy resources to AWS, follow these steps:

2. Configure AWS CLI:

   ```
   aws configure
   ```

   Follow the prompts to enter your AWS Access Key ID, Secret Access Key, default region, and output format.

3. Deploy the infrastructure:

   ```
   cd infrastructure
   aws deploy
   ```

   This command will deploy the necessary AWS resources for the e-commerce project.

4. After running `cdk deploy`, the terminal output will display the following information:

```
Outputs:
InfrastructureStack.APIKeyID = 2ghqy3q4kk
InfrastructureStack.RestAPIEndpointB14C3C54 = https://oeavjwcw8a.execute-api.us-east-2.amazonaws.com/prod/
Stack ARN:
arn:aws:cloudformation:us-east-2:637423186947:stack/InfrastructureStack/12146c30-2dba-11ef-9cd0-025716740bd1
```

5. To retrieve the API key, replace `API_KEY_ID` in the command below with `InfrastructureStack.APIKeyID` output from your terminal:

```
aws apigateway get-api-key --api-key API_KEY_ID --include-value
```

6. You can use the generated API key from running this command as a header in your API calls. For example,

```
curl -X GET \
    -H "x-api-key: YOUR_API_KEY" \
    https://oeavjwcw8a.execute-api.us-east-2.amazonaws.com/prod/endpoint
```

Replace `YOUR_API_KEY` with the actual API key value generated during the infrastructure deployment. This will authenticate your API requests and allow access to the protected resources.

## Usage

Once the e-commerce project is set up and the resources are deployed, you can start using it. Refer to the project's documentation for instructions on how to use the project and any relevant examples.

### Interacting with the API

To use the API of the e-commerce project, follow these steps:

1. Make sure you have the necessary API key from the installation steps. If you haven't retrieved it yet, refer to step 5 in the [Installation](#installation) section.

2. Use the API key as a header in your API calls. For example, if your API key is `YOUR_API_KEY`, you can make a GET request using cURL:

   ```
   curl -X GET \
        -H "x-api-key: YOUR_API_KEY" \
        https://oeavjwcw8a.execute-api.us-east-2.amazonaws.com/prod/endpoint
   ```

   Replace `YOUR_API_KEY` with the actual API key value generated during the infrastructure deployment.

## Tear Down

To tear down the infrastructure created for the e-commerce project, follow these steps:

1. Open a terminal and navigate to the `infrastructure` direcotry and run:

   ```
   cdk destroy
   ```

   This command will remove all the AWS resources created by the CDK stack.
