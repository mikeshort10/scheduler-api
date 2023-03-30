import { aws_appsync as appsync, aws_lambda as lambda } from "aws-cdk-lib";
import { Construct } from "constructs";

export const createInitDockerImageResolver =
  (
    scope: Construct,
    api: appsync.GraphqlApi,
    commonLambdaProps: Omit<lambda.DockerImageFunctionProps, "code">
  ) =>
  (fieldName: string, typeName: "Query" | "Mutation" = "Query") => {
    const lambdaFunction = new lambda.DockerImageFunction(scope, fieldName, {
      ...commonLambdaProps,
      code: lambda.DockerImageCode.fromImageAsset(`dockerImages/${fieldName}`, {
        // cmd: [`${fieldName}.handler`],
      }),
    });

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
