import { run } from "clingo-wasm";

import { AppSyncResolverHandler } from "aws-lambda";
import { GraphQLError } from "graphql";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { not } from "fp-ts/lib/Predicate";
import type {
  QueryCreateScheduleArgs,
  LunchSchedule,
  Shift,
} from "../types/api";
import { clingoResultToAtomCollection } from "../utils/clingo/api";
import {
  getClingoAtomsFromRequest,
  isClingoError,
  isUnsatisfiable,
} from "../utils/clingo/index";

const testEmployees: Shift[] = [
  {
    hours: "ELEVEN_TO_ELEVEN",
    specialty: "CT",
    isCirculating: true,
    employee: {
      isTech: false,
      id: `${10}`,
      clingoId: 10,
      specialties: ["CT"],
    },
  },
  {
    hours: "SEVEN_TO_THREE",
    specialty: "CT",
    isCirculating: true,
    employee: { isTech: false, id: `${20}`, clingoId: 20, specialties: ["CT"] },
  },
  {
    hours: "SEVEN_TO_FIVE",
    specialty: "CT",
    isCirculating: true,
    employee: { isTech: false, id: `${30}`, clingoId: 30, specialties: ["CT"] },
  },
  {
    hours: "SEVEN_TO_SEVEN",
    specialty: "CT",
    isCirculating: true,
    employee: { isTech: false, id: `${40}`, clingoId: 40, specialties: ["CT"] },
  },
];

type Handler = AppSyncResolverHandler<
  QueryCreateScheduleArgs,
  LunchSchedule | GraphQLError
>;

export const handler: Handler = async ({
  arguments: { shifts: employees },
}) => {
  const body = getClingoAtomsFromRequest(employees);

  return run(body, 0)
    .then((result) => {
      if (isClingoError(result)) {
        return new GraphQLError("Server error: Invalid syntax");
      } else if (isUnsatisfiable(result)) {
        return new GraphQLError("Could not create a schedule");
      }
      return pipe(
        result,
        E.fromPredicate(
          not(isClingoError),
          () => new GraphQLError("Server error: Invalid syntax")
        ),
        E.map(clingoResultToAtomCollection),
        E.map(
          ({ cover }): LunchSchedule => ({
            reliefs: cover.map(([reliever, relievee, lunch]) => {
              const lunches = [
                "SEVEN_TO_THREE",
                "SEVEN_TO_FIVE",
                "SEVEN_TO_SEVEN",
              ] as const;
              return {
                reliever: +reliever,
                relievee: +relievee,
                lunch: lunches[+lunch - 1],
              };
            }),
          })
        ),
        E.getOrElseW((e) => e)
      );
    })
    .catch((err: Error) => {
      console.log(err);
      return new GraphQLError("Error evaluating schedule");
    });
};

export default handler;

// handler(
//   {
//     arguments: { employees: testEmployees },
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
