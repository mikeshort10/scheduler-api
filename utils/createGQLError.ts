import { GraphQLError } from "graphql/error/GraphQLError";

export const createGQLError = (message: string) => new GraphQLError(message);

export const createClientGQLError = (
  clientMessage: string,
  serverLogs?: unknown[]
) => {
  serverLogs?.length && console.error(...serverLogs);
  return createGQLError(clientMessage);
};

export const createServerGQLError = (...serverLogs: unknown[]) => {
  serverLogs?.length && console.error(...serverLogs);
  return createGQLError("Server Error");
};
