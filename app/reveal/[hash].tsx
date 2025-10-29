import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAssignment } from "@/context/AssignmentContext";

export default function RevealScreen() {
  const { hash } = useLocalSearchParams<{ hash?: string }>();
  const { decodeHash } = useAssignment();
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<{ giver: string; receiver: string } | null>(null);

  useEffect(() => {
    if (!hash) {
      setError("Kein Code gefunden.");
      setPayload(null);
      return;
    }
    const decoded = decodeHash(hash);
    if (!decoded) {
      setError("Dieser Reveal-Link ist ungültig oder abgelaufen.");
      setPayload(null);
      return;
    }
    setError(null);
    setPayload(decoded);
  }, [decodeHash, hash]);

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.centered]}>
      {!payload ? null : (
        <>
      <Text style={styles.heading}>Ho Ho Ho!</Text>
      <Text style={styles.message}>
        Liebe/r {payload.giver}, du beschenkst dieses Jahr {payload.receiver}.
      </Text>
      <Text style={styles.secondary}>Viel Spaß beim Aussuchen des perfekten Geschenks! 🎁</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff7fb",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#b30059",
    marginBottom: 16,
  },
  message: {
    fontSize: 24,
    color: "#5f0f40",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 34,
  },
  secondary: {
    fontSize: 18,
    color: "#6d6875",
    textAlign: "center",
  },
  error: {
    fontSize: 18,
    color: "#d90429",
    textAlign: "center",
  },
});
