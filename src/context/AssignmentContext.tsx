import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { decodeAssignmentHash, encodeAssignmentHash } from "@/utils/hash";
import { generateAssignments } from "@/utils/matching";

type ParticipantInput = {
  name: string;
  exclusions: string[];
};

type Assignment = {
  giver: string;
  receiver: string;
  hash: string;
};

type AssignmentContextValue = {
  participants: ParticipantInput[];
  setParticipants: (participants: ParticipantInput[]) => void;
  assignments: Assignment[];
  createAssignments: () => Assignment[];
  decodeHash: (hash: string) => { giver: string; receiver: string } | null;
};

const AssignmentContext = createContext<AssignmentContextValue | undefined>(
  undefined,
);

export const AssignmentProvider = ({ children }: { children: ReactNode }) => {
  const [participants, setParticipants] = useState<ParticipantInput[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const createAssignments = useCallback(() => {
    const result = generateAssignments(participants);
    const mapped = result.map(({ giver, receiver }) => ({
      giver,
      receiver,
      hash: encodeAssignmentHash({ giver, receiver }),
    }));
    setAssignments(mapped);
    return mapped;
  }, [participants]);

  const value = useMemo<AssignmentContextValue>(
    () => ({
      participants,
      setParticipants,
      assignments,
      createAssignments,
      decodeHash: decodeAssignmentHash,
    }),
    [assignments, createAssignments, participants],
  );

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignment = () => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error("useAssignment must be used within AssignmentProvider");
  }
  return context;
};

export type { ParticipantInput, Assignment };
