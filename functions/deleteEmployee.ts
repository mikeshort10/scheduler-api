import { AppSyncResolverHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk/";
import { GraphQLError } from "graphql";
import { MutationDeleteEmployeeArgs } from "../types";

type Handler = AppSyncResolverHandler<
  MutationDeleteEmployeeArgs,
  boolean | GraphQLError
>;

const documentClient = new DynamoDB.DocumentClient();

export const handler: Handler = async ({ arguments: { id } }) => {
  try {
    const TableName = process.env.EMPLOYEE_TABLE ?? "EmployeeTable";
    if (TableName == null) {
      throw new GraphQLError("Error: EMPLOYEE_TABLE == null");
    }

    await documentClient.delete({ TableName, Key: { id } }).promise();

    return true;
  } catch (e) {
    console.error(e);
    throw new GraphQLError((e as any)?.toString());
  }
};
