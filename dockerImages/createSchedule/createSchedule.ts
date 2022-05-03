import type { AppSyncResolverHandler } from "aws-lambda";
import { run } from "clingo-wasm";
import { GraphQLError } from "graphql";

export const handler: AppSyncResolverHandler<any, string[]> = async (event) => {
  const situation = event.arguments ?? "a. b :- a.";

  console.log(situation.replace(/%.+$/gm, "").replace(/\n/g, " "));

  const startTime = Date.now();
  const body = await run(situation).then((x) => {
    if (x.Result === "ERROR") {
      throw new GraphQLError("Error calculating schedule");
    } else if (x.Result === "UNSATISFIABLE") {
      return [];
    }
    return x.Call[0].Witnesses[0].Value;
  });

  console.log(`Runtime: ${Date.now() - startTime}`);

  console.log(body);
  return body;
};

/