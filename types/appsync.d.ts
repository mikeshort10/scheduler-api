import type { AppSyncResolverHandler } from "aws-lambda";
import type { GraphQLError } from "graphql";
import type { InputMaybe, Query } from "./api";

export type APSGraphQLAPIResolverHandler<
  FieldName extends keyof Query,
  Args
> = AppSyncResolverHandler<Args, Query[FieldName] | GraphQLError | void>;
