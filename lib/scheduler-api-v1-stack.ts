import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { createInitNodeJsResolver } from "../utils/createInitNodeJsResolver";
import { createInitDockerImageResolver } from "../utils/createInitDockerImageResolver";
import {
  Stack,
  StackProps,
  Expiration,
  Duration,
  Construct,
} from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { DockerImageFunction } from "@aws-cdk/aws-lambda";

const grantReadData = <
  R extends { lambdaFunction: NodejsFunction | DockerImageFunction }
>(
  table: dynamodb.Table,
  fns: R[]
) => {
  fns
    .map(({ lambdaFunction }) => lambdaFunction)
    .forEach((fn) => table.grantReadData(fn));
};

const grantReadWriteData = <
  R extends { lambdaFunction: NodejsFunction | DockerImageFunction }
>(
  table: dynamodb.Table,
  fns: R[]
) => {
  fns
    .map(({ lambdaFunction }) => lambdaFunction)
    .forEach((fn) => table.grantReadWriteData(fn));
};

export class SchedulerApiV1Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "ScheduleApi", {
      name: "scheduler-api",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            name: "API key",
            expires: Expiration.after(Duration.days(365)),
          },
        },
      },
    });

    const employeeTable = new dynamodb.Table(this, "EmployeeTable", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const initNodeJsResolver = createInitNodeJsResolver(this, api, {
      code: lambda.Code.fromAsset("functions"),
      runtime: lambda.Runtime.NODEJS_14_X,
      architecture: lambda.Architecture.ARM_64,
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
