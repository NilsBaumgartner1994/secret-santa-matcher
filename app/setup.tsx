import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ParticipantRow, ParticipantRowValue, rowToParticipants } from "@/components/ParticipantRow";
import { useAssignment } from "@/context/AssignmentContext";

const emptyRow = (): ParticipantRowValue => ({
  first: { name: "", exclusions: "" },
  second: { name: "", exclusions: "" },
});

const toRowValue = (name?: string, exclusions?: string[]) => ({
  name: name ?? "",
  exclusions: exclusions && exclusions.length > 0 ? exclusions.join(", ") : "",
});

export default function SetupScreen() {
  const { participants, setParticipants } = useAssignment();
  const [rows, setRows] = useState<ParticipantRowValue[]>([emptyRow()]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (participants.length > 0) {
      const hydrated: ParticipantRowValue[] = [];
      for (let i = 0; i < participants.length; i += 2) {
        const first = participants[i];
        const second = participants[i + 1];
        hydrated.push({
          first: toRowValue(first?.name, first?.exclusions),
          second: toRowValue(second?.name, second?.exclusions),
        });
      }
      hydrated.push(emptyRow());
      setRows(hydrated);
    }
  }, [participants]);

  const parsedParticipants = useMemo(
    () => rows.flatMap((row) => rowToParticipants(row)),
    [rows],
  );

  const handleNext = () => {
    try {
      if (parsedParticipants.length < 2) {
        setError("Bitte gib mindestens zwei Teilnehmer:innen an.");
        return;
      }
      setParticipants(parsedParticipants);
      setError(null);
      router.push("/assign");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Wer nimmt am Wichteln teil?</Text>
      <Text style={styles.subtitle}>
        Erfasse Paare oder Singles in einer Zeile. Jede Person kann zusätzlich Personen eintragen, die sie
        nicht beschenken darf.
      </Text>
      {rows.map((row, index) => (
        <ParticipantRow
          key={index}
          label={`Paar / Single ${index + 1}`}
          value={row}
          onChange={(updated) => {
            const clone = [...rows];
            clone[index] = updated;
            setRows(clone);
          }}
        />
      ))}
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.addButton}
        onPress={() => setRows([...rows, emptyRow()])}
      >
        <Text style={styles.addButtonText}>Weitere Personen hinzufügen</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Zuordnen</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff7fb",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#b30059",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6d6875",
    marginBottom: 24,
    lineHeight: 24,
  },
  addButton: {
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: "#ffe5ec",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#b30059",
    fontWeight: "600",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#ff4d6d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  error: {
    marginTop: 16,
    color: "#d90429",
    fontWeight: "600",
  },
});
