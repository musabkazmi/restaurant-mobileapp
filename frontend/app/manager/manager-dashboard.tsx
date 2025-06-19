import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import React from "react";

export default function ManagerDashboard() {
  const handleLogout = () => {
    globalThis.userId = null;
    router.replace("/(auth)/login"); // Adjust the path if your login route differs
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Manager Dashboard</Text>
        <Button title="Logout" onPress={handleLogout} color="#ff5555" />
      </View>

      <View style={styles.menu}>
        <Button title="Edit Menu" onPress={() => router.push("/manager/menu-editor")} />
        <View style={styles.spacer} />

        <Button title="View Menu" onPress={() => router.push("/manager/view-menu")} />
        <View style={styles.spacer} />

        <Button title="Ask AI Agent" onPress={() => router.push("/manager/ai-agent")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    padding: 24,
    paddingTop: 60,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  menu: {
    flex: 1,
    justifyContent: "center",
  },
  spacer: {
    height: 16,
  },
});
