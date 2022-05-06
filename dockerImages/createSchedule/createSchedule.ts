import { run } from "clingo-wasm";
import { Ord } from "fp-ts/lib/string";
import { pipe } from "fp-ts/lib/function";
import { GraphQLError } from "graphql";
import {
  APSGraphQLAPIResolverHandler,
  LunchSchedule,
  MutationCreateScheduleArgs,
  Relief,
  Reliever,
} from "./types";
import { getClingoAtomsFromRequest, isClingoResult } from "./utils";
import { clingoResultToAtomCollection } from "./utils/api";
import { A, E, R } from "./utils/fp-ts";

type Handler = APSGraphQLAPIResolverHandler<
  "createSchedule",
  MutationCreateScheduleArgs
>;

export const handler: Handler = async (event) => {
  const body = await run(getClingoAtomsFromRequest(event.arguments.shifts), 0);

  console.log(getClingoAtomsFromRequest(event.arguments.shifts));

  const result = pipe(
    body,
    (x) => (console.log(x), x),
    E.fromPredicate(
      isClingoResult,
      () => new GraphQLError("Server error: Invalid syntax")
    ),
    E.map(clingoResultToAtomCollection),
    E.map(({ cover = [], ...rest }): LunchSchedule => {
      console.log(cover, rest);
      return {
        relievers: pipe(
          cover,
          A.map(([reliever, relievee, lunch]) => {
            const lunches = [
              "SEVEN_TO_THREE",
              "SEVEN_TO_FIVE",
              "SEVEN_TO_SEVEN",
            ] as const;
            return {
              reliever,
              relievee,
              lunch: lunches[+lunch - 1],
            };
          }),
          A.reduce(
            {},
            (acc: Record<string, Relief[]>, { reliever: id, ...relief }) => {
              const reliefs = acc[id] ?? [];
              return { ...acc, [id]: [...reliefs, relief] };
            }
          ),
          R.reduceWithIndex(Ord)(
            [],
            (id, acc: Reliever[], reliefs: Relief[]) => {
              // TODO sort reliefs and fill nulls
              return [...acc, { id, reliefs }];
            }
          )
        ),
      };
    }),
    E.getOrElseW((e) => e)
  );

  if (result instanceof GraphQLError) {
    throw result;
  }

  console.log(result);
  return result;
};
