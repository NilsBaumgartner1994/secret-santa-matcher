import { useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TextStyle,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useAssignment } from "@/context/AssignmentContext";

const BASE_URL = "https://Nilsbaumgartner1994.github.io/secret-santa-matcher";

export default function AssignScreen() {
  const { assignments, createAssignments, participants } = useAssignment();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (participants.length < 2) {
      setError("Bitte kehre zurück und füge zuerst Teilnehmer:innen hinzu.");
      return;
    }
    if (assignments.length === 0) {
      try {
        createAssignments();
      } catch (err) {
        setError((err as Error).message);
      }
    }
  }, [assignments.length, createAssignments, participants.length]);

  const orderedAssignments = useMemo(
    () => assignments.slice().sort((a, b) => a.giver.localeCompare(b.giver)),
    [assignments],
  );

  const handleReveal = (name: string) => {
    setRevealed((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleCopy = async (name: string, hash: string) => {
    const url = `${BASE_URL}/reveal/${hash}`;
    await Clipboard.setStringAsync(url);
    setCopiedId(name);
    setTimeout(() => setCopiedId((current) => (current === name ? null : current)), 2000);
  };

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Ausgeloste Zuordnungen</Text>
      <Text style={styles.subtitle}>
        Tippe auf den schwarzen Button, um den Namen der beschenkten Person aufzudecken. Der individuelle Link kann
        geteilt werden und zeigt nur die passende Zuordnung.
      </Text>
      {orderedAssignments.map((assignment) => {
        const isRevealed = revealed[assignment.giver];
        const link = `${BASE_URL}/reveal/${assignment.hash}`;
        return (
          <View key={assignment.giver} style={styles.assignmentRow}>
            <View style={styles.assignmentInfo}>
              <Text style={styles.giver}>{assignment.giver}</Text>
              <Text style={styles.giftLabel}>schenkt für</Text>
              <TouchableOpacity
                accessibilityRole="button"
                style={[styles.revealButton, isRevealed && styles.revealButtonActive]}
                onPress={() => handleReveal(assignment.giver)}
              >
                <Text style={styles.revealText}>{isRevealed ? assignment.receiver : "Aufdecken"}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              accessibilityRole="button"
              onPress={() => handleCopy(assignment.giver, assignment.hash)}
            >
              <Text style={styles.copyButtonText}>
                {copiedId === assignment.giver ? "Link kopiert!" : "Link kopieren"}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.linkLabel, Platform.OS === "web" ? styles.webLinkLabel : null]}>{link}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff7fb",
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#b30059",
  },
  subtitle: {
    fontSize: 16,
    color: "#6d6875",
    marginBottom: 12,
    lineHeight: 24,
  },
  assignmentRow: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffd6e0",
    shadowColor: "#ffd6e0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  assignmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  giver: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5f0f40",
  },
  giftLabel: {
    fontSize: 16,
    color: "#6d6875",
  },
  revealButton: {
    backgroundColor: "#1b1b1b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  revealButtonActive: {
    backgroundColor: "#2f9e44",
  },
  revealText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  copyButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#ff8fa3",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  copyButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  linkLabel: {
    marginTop: 8,
    fontSize: 14,
    color: "#5f0f40",
  },
  webLinkLabel: {
    wordBreak: "break-all",
  } as unknown as TextStyle,
  error: {
    color: "#d90429",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
