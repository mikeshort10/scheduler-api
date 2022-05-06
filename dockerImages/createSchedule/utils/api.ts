import type { ClingoResult } from "clingo-wasm";
import { flow } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import { isNonNullable } from "./index";
import * as O from "fp-ts/lib/Option";

export type TruthCollection = Partial<Record<string, string[][]>>;

const collectAtomsByType = (
  acc: TruthCollection,
  { truth, parts }: Record<string, string | undefined>
) => {
  if (truth == null || parts == null) {
    return acc;
  }

  return {
    ...acc,
    [truth]: [...(acc[truth] ?? []), ...[parts.split(",")]],
  };
};

export const clingoResultToAtomCollection = flow(
  (result: ClingoResult) => result.Call,
  A.chain(({ Witnesses }) => Witnesses),
  A.map(({ Value }) => Value),
  A.last,
  O.map(
    flow(
      A.map((atom) => atom.match(/(?<truth>[a-z][a-zA-Z]+)\((?<parts>.+)+\)/)),
      A.map((match) => match?.groups),
      A.filter(isNonNullable),
      A.reduce({}, collectAtomsByType)
    )
  ),
  O.getOrElse((): Partial<Record<string, string[][]>> => ({}))
);
