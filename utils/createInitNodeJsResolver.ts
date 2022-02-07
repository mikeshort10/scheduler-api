import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";
import * as nodeJsLambda from "@aws-cdk/aws-lambda-nodejs";
import * as path from "path";

export const createInitNodeJsResolver =
  (
    scope: cdk.Construct,
    api: appsync.GraphqlApi,
    commonLambdaProps: Omit<lambda.FunctionProps, "handler">
  ) =>
  (fieldName: string, typeName: "Query" | "Mutation" = "Query") => {
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

    const resolver = dataSource.createResolver({
      typeName,
      fieldName,
    });

    return { lambdaFunction, dataSource, resolver };
  };
