import type { ClingoError, ClingoResult } from "clingo-wasm";
import { flow, pipe } from "fp-ts/lib/function";
import type { Shift, ShiftHours } from "../types";
import { A } from "./fp-ts";
import { rules } from "./rules";

export const isNonNullable = <X>(x: X): x is NonNullable<X> => x != null;

export const isClingoError = (
  x: ClingoError | ClingoResult
): x is ClingoError => x.Result === "ERROR";

export const isClingoResult = (
  x: ClingoError | ClingoResult
): x is ClingoResult => x.Result !== "ERROR";

export const isUnsatisfiable = (x: ClingoResult) =>
  x.Result === "UNSATISFIABLE";

const getCorsList = ({ employeeId, specialties }: Shift): string[] =>
  pipe(
    specialties ?? [],
    A.filter(isNonNullable),
    A.map((specialty) => `cors(${employeeId}, ${specialty.toLowerCase()})`)
  );

const isCirculating = ({ isTech, isCirculating }: Shift) =>
  isTech ? false : isCirculating;

const getStartAndEndShift = (shiftHours: ShiftHours) => {
  const shiftHoursMap: Record<ShiftHours, { to: number; from: number }> = {
    SEVEN_TO_THREE: { from: 7, to: 3 },
    SEVEN_TO_FIVE: { from: 7, to: 5 },
    SEVEN_TO_SEVEN: { from: 7, to: 7 },
    ELEVEN_TO_ELEVEN: { from: 11, to: 11 },
  };

  return shiftHoursMap[shiftHours];
};

const getShift = ({ employeeId, hours }: Shift): null | string => {
  const { from, to } = getStartAndEndShift(hours);
  return `shift(${employeeId}, ${from}, ${to})`;
};

const getSpecialty = (shift: Shift): null | string => {
  const { employeeId, currentSpecialty } = shift;
  if (currentSpecialty == null) {
    return null;
  }
  return `specialty(${employeeId}, ${currentSpecialty.toLowerCase()})`;
};

const getTech = ({ isTech, employeeId }: Shift) =>
  `isTech(${employeeId}, ${isTech})`;

const getIsCirculating = (shift: Shift): string =>
  `isCirculating(${shift.employeeId}, ${isCirculating(shift)})`;

const getTechs = A.map(getTech);

const getCorsLists = A.chain(getCorsList);

const getSpecialties = flow(A.map(getSpecialty), A.filter(isNonNullable));

const getShifts = flow(A.map(getShift), A.filter(isNonNullable));

const getIsCirculatings = A.map(getIsCirculating);

export const getClingoAtomsFromRequest = flow(
  (employees: Shift[]): string[][] =>
    [getTechs, getShifts, getCorsLists, getIsCirculatings, getSpecialties].map(
      (fn) => fn(employees)
    ),
  A.flatten,
  A.filter((str) => str !== ""),
  A.map((str) => `${str}.`),
  A.concat([rules]),
  (str) => str.join(" ")
);
