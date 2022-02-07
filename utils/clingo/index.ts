import { ClingoError, ClingoResult } from "clingo-wasm";
import { flow, pipe } from "fp-ts/lib/function";
import * as path from "path";
import * as fs from "fs";
import { Shift, ShiftHours } from "../../types";
import { A } from "../fp-ts";

export const isNonNullable = <X>(x: X): x is NonNullable<X> => x != null;

export const isClingoError = (
  x: ClingoError | ClingoResult
): x is ClingoError => x.Result === "ERROR";

export const isUnsatisfiable = (x: ClingoResult) =>
  x.Result === "UNSATISFIABLE";

const getSpecialtyList = ({ specialty, employee }: Shift): string[] =>
  pipe(
    employee.specialties,
    A.filter(isNonNullable),
    A.map(
      (specialty) => `specialty(${employee.id}, ${specialty.toLowerCase()})`
    )
  );

const isCirculating = ({ employee, isCirculating }: Shift) =>
  employee.isTech ? false : isCirculating;

const getStartAndEndShift = (shiftHours: ShiftHours) => {
  const shiftHoursMap: Record<ShiftHours, { to: number; from: number }> = {
    SEVEN_TO_THREE: { from: 7, to: 3 },
    SEVEN_TO_FIVE: { from: 7, to: 5 },
    SEVEN_TO_SEVEN: { from: 7, to: 7 },
    ELEVEN_TO_ELEVEN: { from: 11, to: 11 },
  };

  return shiftHoursMap[shiftHours];
};

const getPerson = (shift: Shift): null | string => {
  const { employee, isCirculating, specialty, hours } = shift;
  const { id, isTech } = employee;
  const { from, to } = getStartAndEndShift(hours);

  return `person(${id}, ${from}, ${to}, ${isTech}, ${isCirculating}, ${specialty.toLowerCase()})`;
};

const getTech = ({ employee: { isTech, id } }: Shift) =>
  `isTech(${id}, ${isTech})`;

const getIsCirculating = (shift: Shift): string =>
  `isCirculating(${shift.employee.id}, ${isCirculating(shift)})`;

const getTechs = A.map(getTech);

const getSpecialties = A.chain(getSpecialtyList);

const getPersons = flow(A.map(getPerson), A.filter(isNonNullable));

const getIsCirculatings = A.map(getIsCirculating);

export const getClingoAtomsFromRequest = flow(
  (employees: Shift[]): string[][] =>
    [getTechs, getPersons, getSpecialties, getIsCirculatings].map((fn) =>
      fn(employees)
    ),
  A.flatten,
  A.filter((str) => !!str),
  A.map((str) => `${str}.`),
  (str) =>
    pipe(
      ["northwell_scheduling.lp", "immutable_state.lp"],
      A.map((fileName) =>
        path.join(process.cwd(), "clingo", "northwell_scheduling", fileName)
      ),
      A.map((file) => fs.readFileSync(file, "utf-8")),
      A.concat(str)
    ),
  (str) => str.join(" ")
);
