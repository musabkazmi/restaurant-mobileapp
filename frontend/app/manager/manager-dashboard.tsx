import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function ManagerDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manager Dashboard</Text>
      <Button title="Edit Menu" onPress={() => router.push("/manager/menu-editor")} />
      <Button title="View Menu" onPress={() => router.push("/manager/view-menu")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
});
