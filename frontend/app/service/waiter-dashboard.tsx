// app/waiter/waiter-dashboard.tsx
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function WaiterDashboard() {
  const handleLogout = () => {
    globalThis.userId = null;
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👔 Service Member</Text>

      <Button
        title="Start a New Order"
        onPress={() => router.push("/service/new-order")}
      />
      <View style={styles.spacer} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },
  spacer: {
    height: 16,
  },
});
