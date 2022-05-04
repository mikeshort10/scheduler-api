import { AppSyncResolverHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk/";
import { GraphQLError } from "graphql";
import { Maybe, Employee, MutationCreateEmployeeArgs } from "../types";
import { v4 as uuidv4 } from "uuid";

type Handler = AppSyncResolverHandler<
  MutationCreateEmployeeArgs,
  Maybe<Employee> | GraphQLError
>;

const documentClient = new DynamoDB.DocumentClient();

export const handler: Handler = async (event) => {
  try {
    const TableName = process.env.EMPLOYEE_TABLE ?? "EmployeeTable";
    if (TableName == null) {
      console.error("Error: EMPLOYEE_TABLE == null");
      return null;
    }

    const employee: Employee = {
      ...event.arguments.employee,
      id: `v1_${uuidv4().replace("-", "_")}`,
    };

    await documentClient
      .put({
        TableName,
        Item: employee,
      })
      .promise();

    return employee;
  } catch (e) {
    console.error(e);
    throw new GraphQLError((e as any)?.toString());
  }
};
