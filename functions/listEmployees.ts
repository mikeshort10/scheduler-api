import { AppSyncResolverHandler } from "aws-lambda";
import { GraphQLError } from "graphql";
import type { Employee } from "../types/api";

import { DynamoDB } from "aws-sdk";

type Handler = AppSyncResolverHandler<{}, Employee[] | GraphQLError>;

const documentClient = new DynamoDB.DocumentClient();

export const handler: Handler = async () => {
  try {
    if (process.env.EMPLOYEE_TABLE == null) {
      console.log("Error: EMPLOYEE_TABLE is null");

      return [];
    }
    const { Items = [] } = await documentClient
      .scan({ TableName: process.env.EMPLOYEE_TABLE })
      .promise();

    return Items as Employee[];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default handler;

// handler(
//   {
//     arguments: { id: "" },
//     source: {},
//     request: { headers: {} },
//     info: {
//       selectionSetGraphQL: "",
//       selectionSetList: [],
//       parentTypeName: "",
//       fieldName: "",
//       variables: {},
//     },
//     prev: { result: [] },
//     stash: {},
//   },
//   {
//     callbackWaitsForEmptyEventLoop: false,
//     functionName: "",
//     functionVersion: "",
//     invokedFunctionArn: "",
//     memoryLimitInMB: "",
//     awsRequestId: "",
//     logGroupName: "",
//     logStreamName: "",
//     getRemainingTimeInMillis: () => 0,
//     done: () => {
//       console.log("done");
//     },
//     fail,
//     succeed: () => {
//       console.log("success");
//     },
//   },
//   () => {
//     console.log("callback");
//   }
// )?.then(console.log);
