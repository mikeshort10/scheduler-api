% Everyone 7am gets a lunch
1 {lunch(P, L): lunch(L)} 1 :- person(P, 7, D, TB, CB, S), boolean(TB), boolean(CB).

% If a your a 7am person, then you have to have coverage from another person
{cover(P1, P2, L): person(P1, S1, D1, TB1, CB1, _S), P1 != P2 } = 1 :- person(P2, 7, D2, TB2, CB2, S), lunch(P2, L).

% It cannot happen that a person covering another person's lunch does not share their specialty or have the specialty all.
:- cover(P1, P2, Lunch), person(P2, Start, End, IsTech, IsCirc, S2), {specialty(P1, S2)} = 0, {specialty(P1, all)} = 0.

% An 11-11 cannot cover two people for the same lunch
:- cover(P1, P2, L), cover(P1, P3, L), P2!=P3.

% A 7am cannot cover another 7am ??
:- cover(P1, P2, L), person(P1, 7, End, IsTech, IsCirc, S).

% Someone cannot cover a lunch that they're receiving coverage for
:- cover(P1, P2, L), cover(P2, P3, L).

% It cannot happen that P1 covers P2, and P1 is a tech and P2 is not a tech (nurse)
% A tech cannot cover a nurse
:- cover(P1, P2, L), person(P1, S1, D1, true, CB1, S1), person(P2, S2, D2, false, CB2, S2).

% It cannot happen that a tech covers for a nurse who is circulating
:- cover(P1, P2, L), person(P1, S1, D1, true, C, S1), person(P2, S2, D2, false, true, S2).

% PENALTIES 
penalty(P, 2) :- person(P, 7, 3, TB, CB, S), cover(C, P, 2).
penalty(P, 5) :- person(P, 7, 3, TB, CB, S), cover(C, P, 3).
penalty(P, 100) :- person(P, 7, 5, TB, CB, S), cover(C, P, 1).
penalty(P, 4) :- person(P, 7, 5, TB, CB, S), cover(C, P, 3).
penalty(P, 1000) :- person(P, 7, 7, TB, CB, S), cover(C, P, 1).
penalty(P, 7) :- person(P, 7, 7, TB, CB, S), cover(C, P, 2).

penalty(P2, 100000) :- person(P1, 7, D1, TB1, CB1, S), cover(P2, P1, L), person(P2, 7, D2, TB2, CB2, S2), lunch(L).

totalPenalty(TP) :- TP = #sum{Penality, Person : penalty(Person, Penality)}.

#minimize{TP:totalPenalty(TP)}.

#show penalty/2.
#show cover/3.