import type { AppSyncResolverHandler } from "aws-lambda";
import type { GraphQLError } from "graphql";
import type { Mutation, Query } from "./api";

export type APSGraphQLAPIResolverHandler<
  FieldName extends keyof Query | keyof Mutation,
  Args
> = AppSyncResolverHandler<
  Args,
  FieldName extends keyof Query
    ? Query[FieldName]
    : FieldName extends keyof Mutation
    ? Mutation[FieldName]
    : never | GraphQLError | void
>;
