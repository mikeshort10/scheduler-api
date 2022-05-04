export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Cors =
  | 'ALL'
  | 'BRONC'
  | 'CT'
  | 'ENT'
  | 'GENGYN'
  | 'NEURO'
  | 'OPHTHALMOLOGY'
  | 'ORTHO'
  | 'PEDS'
  | 'PU'
  | 'ROBOTICS';

export type CreateEmployeeInput = {
  additionalSpecialties: Array<Cors>;
  clingoId?: InputMaybe<Scalars['Int']>;
  isTech: Scalars['Boolean'];
  name: Scalars['String'];
  primarySpecialty: Cors;
  usualHours?: InputMaybe<ShiftHours>;
};

export type Employee = {
  __typename?: 'Employee';
  additionalSpecialties: Array<Cors>;
  clingoId?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  isTech: Scalars['Boolean'];
  name: Scalars['String'];
  primarySpecialty: Cors;
  usualHours?: Maybe<ShiftHours>;
};

export type LunchHours =
  | 'SEVEN_TO_FIVE'
  | 'SEVEN_TO_SEVEN'
  | 'SEVEN_TO_THREE';

export type LunchSchedule = {
  __typename?: 'LunchSchedule';
  reliefs: Array<Reliever>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createEmployee?: Maybe<Employee>;
  createSchedule?: Maybe<LunchSchedule>;
  deleteEmployee: Scalars['Boolean'];
};


export type MutationCreateEmployeeArgs = {
  employee: CreateEmployeeInput;
};


export type MutationCreateScheduleArgs = {
  shifts: Array<Shift>;
};


export type MutationDeleteEmployeeArgs = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  getEmployee?: Maybe<Employee>;
  listEmployees: Array<Employee>;
};


export type QueryGetEmployeeArgs = {
  id: Scalars['ID'];
};

export type Relief = {
  __typename?: 'Relief';
  lunch: LunchHours;
  relievee: Scalars['ID'];
};

export type Reliever = {
  __typename?: 'Reliever';
  id: Scalars['ID'];
  reliefs?: Maybe<Array<Maybe<Relief>>>;
};

export type Shift = {
  currentSpecialty?: InputMaybe<Cors>;
  employeeId: Scalars['ID'];
  hours: ShiftHours;
  isCirculating: Scalars['Boolean'];
  isTech: Scalars['Boolean'];
  specialties?: InputMaybe<Array<Cors>>;
};

export type ShiftHours =
  | 'ELEVEN_TO_ELEVEN'
  | 'SEVEN_TO_FIVE'
  | 'SEVEN_TO_SEVEN'
  | 'SEVEN_TO_THREE';
