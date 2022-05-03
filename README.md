# Operating Room Scheduler

## Description

An API that helps calculate valid/optimal schedules for operating rooms at a specific hospital.

## Definitions

- **Schedule**: a schedule of Subs relieving Primaries so they can eat.
- **Employee**: A nurse or tech who works in an operating room.
- **Sub**: An Employee who relieves another Employee for lunch.
- **Primary**: An Employee who needs coverage for lunch.
- **Shift**: Time when an Employee starts/ends work.

  - **Start times** denote if an Employee is a Primary (7am) or Sub (11am). Even if a Sub starts earlier, they will be coded as starting at 11am.

  - **End times** are only important for Primaries (3/5/7pm) and are ignored for Subs.

- **Lunch**: Time to eat, denoted 1st, 2nd, or 3rd.
- **Specialty**: What skill a Primary is working in during a given shift. An employee can have at most one per shift.
- **Cors**: The Specialty that a Sub/Primary can provide coverage for. An Employee can multiple have Cors.

### Specialties/Cors

- All _(This is Cors only, not a Specialty)_
- ENT
- Cardio-thoracic
- General/Gynecology
- Pediatrics
- Neurology
- Plastics/Urology
- Orthopedics
- Robotics
- Ophthalmology
- Bronchology

## Rules

A double asterisk (\*\*) denotes a common sense rule, i.e. one that is obvious to a human, but not necessarily a machine. An implicit rule begins with "As a result" and can be inferred from the previous rule, so do not need to be explicitly defined.

1. Everyone Primary gets a lunch.
2. \*\*Primaries must have relief from another Employee.
3. \*\*A Sub cannot relieve 2 Employees for the same lunch.
   - As a result, a Sub cannot relieve _more than_ 2 Employees for the same lunch.
4. \*\*A Primary cannot also be a Sub during the same lunch.

   - As a result, a Primary cannot relieve themselves.

5. To relieve a Primary with Specialty S, a Sub must have the Cors S or "all".
6. A tech cannot relieve a nurse.
7. A tech cannot relieve a circulating nurse (??).

### Coverage Rules:

N*: nurse
T*: tech
*C: circulating
*S: scrubbed

| Sub\Primary | NC  | NS  | TC  | TS  |
| ----------- | --- | --- | --- | --- |
| NC          | X   | X   | X   | X   |
| NS          | X   | X   | X   | X   |
| TC          |     |     | X   | X   |
| TS          |     |     | X   | X   |

_\*X = Sub can relieve Primary_

## Penalties

The rules listed above are _hard_ rules, i.e. a particular schedule is rejected if it violates any of them. This helps the program return only valid schedules. However, if none of the schedules meet the criteria, then no schedule will be generated. While this is fine for most scenarios, in certain cases we may want to define an _optimal_ rather than a _valid_ schedule. In this case, we award penalties to suboptimal scenarios. The program will return the scenario with the lowest possible penalty, ideally zero for an ideal schedule.

The intuition behind these penalties is that smaller penalties should be allowed, so long as they do not total more than a larger penalty.

For example, a 1st shift should always be assigned to second lunch over third lunch, all else being equal. However, it is acceptable for a single 1st shift to be assigned third lunch, if it means three or more 1st shifts are not assigned to second lunch. Both should be allowed, though, if it keeps a 3rd shift from being assigned to first lunch.

| Shift\Lunch   | 1    | 2   | 3   |
| ------------- | ---- | --- | --- |
| 7am-3pm (1st) | 0    | 2   | 5   |
| 7am-5pm (2nd) | 100  | 0   | 4   |
| 7am-7pm (3rd) | 1000 | 7   | 0   |

Additionally, 10,000 penalty points will be added if a Primary must cover another Primary's lunch. This would then be a rare occurrence, but not a hard rule.
