import { ClingoResult } from "clingo-wasm";
import { flow } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import { isNonNullable } from "./index";

export type TruthCollection = Record<string, string[][]>;

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
  A.chain(({ Value }) => Value),
  A.map((atom) => atom.match(/(?<truth>[a-z][a-zA-Z]+)\((?<parts>.+)+\)/)),
  A.map((match) => match?.groups),
  A.filter(isNonNullable),
  A.reduce({}, collectAtomsByType)
);
