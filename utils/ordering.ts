import { pipe } from "fp-ts/lib/function";
import { Ordering } from "fp-ts/lib/Ordering";
import { Ord } from "fp-ts/lib/string";
import { Maybe } from "graphql/jsutils/Maybe";
import { R } from "./fp-ts";

export const createOrderPrimitive =
  ({ isDesc = false }) =>
  <P extends Maybe<string | number | boolean>>(a: P, b: P): Ordering => {
    const [bLess, aLess]: [Ordering, Ordering] = isDesc ? [-1, 1] : [1, -1];
    if ((a == null && b == null) || a === b) {
      return 0;
    }
    if (a == null || b == null) {
      return b == null ? bLess : aLess;
    }
    return a < b ? bLess : aLess;
  };

type Config<O, P> = {
  isDesc?: boolean;
  getter: (obj: O) => P;
};

export const createOrderObject = <
  O extends Record<string, unknown>,
  P extends Maybe<string | number | boolean>
>({
  getter,
  ...config
}: Config<O, P>) => {
  const orderByPrimitive = createOrderPrimitive(config);
  return (a: O, b: O) => orderByPrimitive(getter(a), getter(b));
};

const values = <K extends number, V>(obj: Record<K, V>): V[] =>
  pipe(
    obj,
    R.reduce(Ord)([], (acc: V[], value) => [...acc, value])
  );
