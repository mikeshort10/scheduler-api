% If you're a 7am person, then you have to have coverage from another person
{cover(P1, P2, L): shift(P1, ST1, D1), P1 != P2, L=1..3 } = 1 :- shift(P2, 7, D2).

% It cannot happen that a person covering another person's lunch does not share their specialty or have the specialty all.
:- cover(P1, P2, Lunch), specialty(P2, S), {cors(P1, S)} = 0, {cors(P1, all)} = 0.

% An 11-11 cannot cover two people for the same lunch
:- cover(P1, P2, L), cover(P1, P3, L), P2!=P3.

% Someone cannot cover a lunch that they're receiving coverage for
:- cover(P1, P2, L), cover(P2, P3, L).

% A tech cannot cover a nurse who is circulating
:- cover(P1, P2, L), isTech(P1, true), isTech(P2, false), isCirculating(PR, true).

% PENALTIES 
penalty(P, 5) :- shift(P, 7, 3), cover(C, P, 3).
penalty(P, 2) :- shift(P, 7, 3), cover(C, P, 2).
penalty(P, 100) :- shift(P, 7, 5), cover(C, P, 1).
penalty(P, 4) :- shift(P, 7, 5), cover(C, P, 3).
penalty(P, 1000) :- shift(P, 7, 7), cover(C, P, 1).
penalty(P, 7) :- shift(P, 7, 7), cover(C, P, 2).

% large penalty for making a primary cover someone
penalty(P2, 50000) :- cover(P2, P1, L), shift(P2, 7, D2).

% extra penalty for making a primary cover 2+ times
% TODO this still administers equal penalty for a primary relieving 2 or 3 times. We need to redefine totalPenalty to include that logic though.
penalty(P1, 1000000) :- cover(P1, P2, L1), cover(P1, P3, L2), shift(P1, 7, D1), L1 != L2.

totalPenalty(TP) :- TP = #sum{Penality, Person : penalty(Person, Penality)}.

#minimize{TP:totalPenalty(TP)}.

#show penalty/2.
#show cover/3.