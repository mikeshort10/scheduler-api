import { AppSyncResolverHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk/";
import { GraphQLError } from "graphql";
import { QueryGetEmployeeArgs, Maybe, Employee } from "../types";

type Handler = AppSyncResolverHandler<
  QueryGetEmployeeArgs,
  Maybe<Employee> | GraphQLError
>;

const documentClient = new DynamoDB.DocumentClient();

export const handler: Handler = async ({ arguments: { id } }) => {
  try {
    const TableName = process.env.EMPLOYEE_TABLE ?? "EmployeeTable";
    if (TableName == null) {
      throw new GraphQLError("Error: EMPLOYEE_TABLE == null");
    }

    const x = await documentClient.get({ TableName, Key: { id } }).promise();

    return x.Item as Maybe<Employee>;
  } catch (e) {
    console.error(e);
    throw new GraphQLError((e as any)?.toString());
  }
};
