import type { ParticipantInput } from "@/context/AssignmentContext";

type Pair = {
  giver: string;
  receiver: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

const hasValidParticipants = (participants: ParticipantInput[]) =>
  participants.filter((participant) => participant.name.trim().length > 0).length >= 2;

const prepareParticipants = (participants: ParticipantInput[]) =>
  participants
    .filter((participant) => participant.name.trim().length > 0)
    .map((participant) => ({
      ...participant,
      name: participant.name.trim(),
      normalizedName: normalize(participant.name),
      normalizedExclusions: new Set(
        participant.exclusions
          .map(normalize)
          .filter((value) => value.length > 0),
      ),
    }));

const canAssign = (
  giver: ReturnType<typeof prepareParticipants>[number],
  receiver: ReturnType<typeof prepareParticipants>[number],
) => {
  if (giver.normalizedName === receiver.normalizedName) {
    return false;
  }
  return !giver.normalizedExclusions.has(receiver.normalizedName);
};

const backtrack = (
  givers: ReturnType<typeof prepareParticipants>,
  receivers: ReturnType<typeof prepareParticipants>,
  current: Pair[],
): Pair[] | null => {
  if (givers.length === 0) {
    return current;
  }

  const [giver, ...restGivers] = givers;

  for (let i = 0; i < receivers.length; i += 1) {
    const receiver = receivers[i];
    if (!canAssign(giver, receiver)) {
      continue;
    }
    const remaining = receivers.slice(0, i).concat(receivers.slice(i + 1));
    const result = backtrack(restGivers, remaining, [...current, { giver: giver.name, receiver: receiver.name }]);
    if (result) {
      return result;
    }
  }

  return null;
};

export const generateAssignments = (participants: ParticipantInput[]): Pair[] => {
  if (!hasValidParticipants(participants)) {
    return [];
  }

  const prepared = prepareParticipants(participants);

  // Ensure everyone excludes themselves by default
  prepared.forEach((participant) => {
    participant.normalizedExclusions.add(participant.normalizedName);
  });

  const result = backtrack(prepared, prepared, []);

  if (!result) {
    throw new Error(
      "Es konnte keine gültige Zuordnung gefunden werden. Bitte überprüfe die Ausschlüsse und versuche es erneut.",
    );
  }

  return result;
};
