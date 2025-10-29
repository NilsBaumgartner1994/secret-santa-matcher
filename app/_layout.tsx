import { Stack } from "expo-router";
import { AssignmentProvider } from "@/context/AssignmentContext";

export default function RootLayout() {
  return (
    <AssignmentProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="setup"
          options={{
            title: "Teilnehmer:innen",
          }}
        />
        <Stack.Screen
          name="assign"
          options={{
            title: "Auslosung",
          }}
        />
        <Stack.Screen
          name="reveal/[hash]"
          options={{
            title: "Geheimnis lüften",
          }}
        />
      </Stack>
    </AssignmentProvider>
  );
}
