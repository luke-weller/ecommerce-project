# e-Commerce Project

A basic e-commerce project showcasing my work as an example for employers. This project demonstrates the implementation of essential features and functionalities required for an e-commerce platform. Follow the instructions below to set it up locally and deploy resources to AWS.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [EcomCLI](#ecomcli)
- [Tear Down](#tear-down)

## Prerequisites

Before setting up the e-commerce project, make sure you have the following prerequisites:

1. An AWS account: If you don't have an AWS account, you can create one [here](https://aws.amazon.com/).
2. AWS CLI: Install the AWS Command Line Interface (CLI) by following the instructions in the [AWS CLI User Guide](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).
3. Docker: Download and install Docker from the official website [here](https://www.docker.com/get-started).
4. Clone the project

   ```
   git clone https://github.com/your-username/ecommerce-project.git
   ```

5. Configure AWS CLI:

   ```
   aws configure
   ```

   Follow the prompts to enter your AWS Access Key ID, Secret Access Key, default region, and output format.

## Installation

### Setting up the project infrastructure

To set up the e-commerce project locally and deploy resources to AWS, follow these steps:

1. Deploy the infrastructure:

   ```
   cd infrastructure
   aws deploy
   ```

   This command will deploy the necessary AWS resources for the e-commerce project.

2. After running `cdk deploy`, the terminal output will display the following information:

```
Outputs:
InfrastructureStack.APIKeyID = 2ghqy3q4kk
InfrastructureStack.RestAPIEndpointB14C3C54 = https://oeavjwcw8a.execute-api.us-east-2.amazonaws.com/prod/
Stack ARN:
arn:aws:cloudformation:us-east-2:637423186947:stack/InfrastructureStack/12146c30-2dba-11ef-9cd0-025716740bd1
```

3. To retrieve the API key, replace `API_KEY_ID` in the command below with `InfrastructureStack.APIKeyID` output from your terminal:

```
aws apigateway get-api-key --api-key API_KEY_ID --include-value
```

4. You can use the generated API key from running this command as a header in your API calls. For example,

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

### EcomCLI

To aid in the development process, a CLI tool has been built for this project. To use it, follow these steps:

1. Make sure you are in the root directory of the project.
2. Run the following command to make the `ecomcli.sh` file executable:

   ```
   chmod +x ecomcli.sh
   ```

   Note: This command only needs to be run during the first setup.

3. Run the following command to start the CLI:

   ```
   ./ecomcli.sh
   ```

   This will launch the EcomCLI and provide you with a set of available commands.

   Example usage: `help`

   The `help` command will display all the available commands and their descriptions. The EcomCLI is designed to streamline the development process, allowing you to deploy, test, and perform other common tasks more efficiently and with reduced errors.

## Tear Down

To tear down the infrastructure created for the e-commerce project, follow these steps:

1. Open a terminal and navigate to the `infrastructure` directory and run:

   ```
   cdk destroy
   ```

   This command will remove all the AWS resources created by the CDK stack.
