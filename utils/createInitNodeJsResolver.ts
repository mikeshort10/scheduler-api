import {
  aws_appsync as appsync,
  aws_lambda as lambda,
  aws_lambda_nodejs as nodeJsLambda,
} from "aws-cdk-lib";
import * as path from "path";
import { Mutation, Query } from "../types";
import { Construct } from "constructs";

export const createInitNodeJsResolver =
  (
    scope: Construct,
    api: appsync.GraphqlApi,
    commonLambdaProps: Omit<lambda.FunctionProps, "handler">
  ) =>
  <QM extends Query | Mutation>(
    fieldName: keyof Mutation | keyof Query,
    typeName: NonNullable<QM["__typename"]>
  ) => {
    const lambdaFunction = new nodeJsLambda.NodejsFunction(
      scope,
      `${fieldName}Handler`,
      {
        ...commonLambdaProps,
        entry: path.join(__dirname, `../functions/${fieldName}.ts`),
      }
    );

    const dataSource = api.addLambdaDataSource(
      `${fieldName}DataSource`,
      lambdaFunction
    );

    const resolver = dataSource.createResolver(`${fieldName}Resolver`, {
      typeName,
      fieldName,
    });

    return { lambdaFunction, dataSource, resolver };
  };
