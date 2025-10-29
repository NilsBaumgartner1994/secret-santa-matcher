import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Landing() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Secret Santa Matcher</Text>
      <Text style={styles.description}>
        Organisiere euer Wichteln in wenigen Klicks. Erfasse alle Teilnehmer:innen,
        hinterlege Ausschlüsse und teile automatisch generierte Reveal-Links.
      </Text>
      <Link href="/setup" style={styles.startButton}>
        <Text style={styles.startText}>Los geht&apos;s</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff7fb",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#b30059",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "#5f0f40",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 28,
  },
  startButton: {
    backgroundColor: "#ff4d6d",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    shadowColor: "#ff4d6d",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  startText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});
