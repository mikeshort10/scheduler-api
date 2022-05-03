import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as lambda from "@aws-cdk/aws-lambda";
import { DockerImageFunction } from "@aws-cdk/aws-lambda";

export const createInitDockerImageResolver =
  (
    scope: cdk.Construct,
    api: appsync.GraphqlApi,
    commonLambdaProps: Omit<lambda.DockerImageFunctionProps, "code">
  ) =>
  (fieldName: string, typeName: "Query" | "Mutation" = "Query") => {
    const lambdaFunction = new DockerImageFunction(scope, fieldName, {
      ...commonLambdaProps,
      code: lambda.DockerImageCode.fromImageAsset(`dockerImages/${fieldName}`, {
        // cmd: [`${fieldName}.handler`],
      }),
    });

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
