import { createInitNodeJsResolver } from "../utils/createInitNodeJsResolver";
import { createInitDockerImageResolver } from "../utils/createInitDockerImageResolver";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

const grantReadData = <R extends { lambdaFunction: cdk.aws_iam.IGrantable }>(
  table: cdk.aws_dynamodb.Table,
  fns: R[]
) => {
  fns
    .map(({ lambdaFunction }) => lambdaFunction)
    .forEach((fn) => table.grantReadData(fn));
};

const grantReadWriteData = <
  R extends {
    lambdaFunction:
      | cdk.aws_lambda_nodejs.NodejsFunction
      | cdk.aws_lambda.DockerImageFunction;
  }
>(
  table: cdk.aws_dynamodb.Table,
  fns: R[]
) => {
  fns
    .map(({ lambdaFunction }) => lambdaFunction)
    .forEach((fn) => table.grantReadWriteData(fn));
};

export class SchedulerApiV1Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new cdk.aws_appsync.GraphqlApi(this, "ScheduleApi", {
      name: "scheduler-api",
      schema: cdk.aws_appsync.SchemaFile.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: cdk.aws_appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            name: "API key",
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
    });

    const employeeTable = new cdk.aws_dynamodb.Table(this, "EmployeeTable", {
      partitionKey: {
        name: "id",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const initNodeJsResolver = createInitNodeJsResolver(this, api, {
      code: cdk.aws_lambda.Code.fromAsset("functions"),
      runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
      architecture: cdk.aws_lambda.Architecture.ARM_64,
      memorySize: 1024,
      environment: {
        EMPLOYEE_TABLE: employeeTable.tableName,
      },
    });

    const initDockerImageResolver = createInitDockerImageResolver(this, api, {
      environment: {
        EMPLOYEE_TABLE: employeeTable.tableName,
      },
    });

    const createScheduleResolver = initDockerImageResolver(
      "createSchedule",
      "Mutation"
    );
    const createEmployeeResolver = initNodeJsResolver(
      "createEmployee",
      "Mutation"
    );
    // const updateEmployeeResolver = initNodeJsResolver(
    //   "updateEmployee",
    //   "Mutation"
    // );
    const deleteEmployeeResolver = initNodeJsResolver(
      "deleteEmployee",
      "Mutation"
    );
    const listEmployeesResolver = initNodeJsResolver("listEmployees", "Query");
    const getEmployeeResolver = initNodeJsResolver("getEmployee", "Query");

    grantReadData(employeeTable, [
      createScheduleResolver,
      listEmployeesResolver,
      getEmployeeResolver,
    ]);

    grantReadWriteData(employeeTable, [
      createEmployeeResolver,
      // updateEmployeeResolver,
      deleteEmployeeResolver,
    ]);
  }
}
