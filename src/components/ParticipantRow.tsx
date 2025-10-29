import { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export type ParticipantRowValue = {
  first: ParticipantField;
  second: ParticipantField;
};

type ParticipantField = {
  name: string;
  exclusions: string;
};

type ParticipantRowProps = {
  label: string;
  value: ParticipantRowValue;
  onChange: (value: ParticipantRowValue) => void;
};

const parseInput = (input: string) =>
  input
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

export const ParticipantRow = ({ label, value, onChange }: ParticipantRowProps) => {
  const exclusionsHint = useMemo(
    () =>
      "Kommagetrennte Liste (z.B. `Alex, Taylor`). Selbst und Partner:in werden automatisch ausgeschlossen.",
    [],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.personRow}>
        <View style={styles.personColumn}>
          <Text style={styles.fieldLabel}>Partner:in A</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Name"
            value={value.first.name}
            onChangeText={(text) => onChange({ ...value, first: { ...value.first, name: text } })}
          />
          <Text style={styles.fieldLabel}>Ausschlüsse</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="z.B. Alex, Taylor"
            multiline
            value={value.first.exclusions}
            onChangeText={(text) => onChange({ ...value, first: { ...value.first, exclusions: text } })}
          />
          <Text style={styles.hint}>{exclusionsHint}</Text>
        </View>
        <View style={styles.personColumn}>
          <Text style={styles.fieldLabel}>Partner:in B (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Name"
            value={value.second.name}
            onChangeText={(text) => onChange({ ...value, second: { ...value.second, name: text } })}
          />
          <Text style={styles.fieldLabel}>Ausschlüsse</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="z.B. Alex, Taylor"
            multiline
            value={value.second.exclusions}
            onChangeText={(text) => onChange({ ...value, second: { ...value.second, exclusions: text } })}
          />
          <Text style={styles.hint}>{exclusionsHint}</Text>
        </View>
      </View>
    </View>
  );
};

export const rowToParticipants = (row: ParticipantRowValue) => {
  const participants = [] as {
    name: string;
    exclusions: string[];
  }[];

  const firstName = row.first.name.trim();
  const secondName = row.second.name.trim();

  if (firstName.length > 0) {
    const exclusions = new Set(parseInput(row.first.exclusions));
    if (secondName.length > 0) {
      exclusions.add(secondName);
    }
    participants.push({
      name: firstName,
      exclusions: Array.from(exclusions),
    });
  }

  if (secondName.length > 0) {
    const exclusions = new Set(parseInput(row.second.exclusions));
    if (firstName.length > 0) {
      exclusions.add(firstName);
    }
    participants.push({
      name: secondName,
      exclusions: Array.from(exclusions),
    });
  }

  return participants;
};

const styles = StyleSheet.create({
  container: {
    borderColor: "#ffd6e0",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    backgroundColor: "#fff",
    shadowColor: "#ffd6e0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#b30059",
  },
  personRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  personColumn: {
    flex: 1,
    minWidth: 280,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#5f0f40",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ffccd5",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  hint: {
    fontSize: 12,
    color: "#6d6875",
    marginBottom: 12,
  },
});
