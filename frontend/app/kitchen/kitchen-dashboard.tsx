// app/kitchen/kitchen-dashboard.tsx
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function KitchenDashboard() {
  const handleLogout = () => {
    globalThis.userId = null;
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍🍳 Kitchen Staff Dashboard</Text>

      <Button title="View Orders" onPress={() => router.push("/kitchen/view-orders")} />
      <View style={styles.spacer} />
      
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#222",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  spacer: {
    height: 16,
  },
});
