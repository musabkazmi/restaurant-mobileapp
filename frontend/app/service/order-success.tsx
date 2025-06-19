// app/service/order-success.tsx
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function OrderSuccess() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Order Placed Successfully!</Text>
      <Text style={styles.subtitle}>The kitchen has received your order.</Text>

      <View style={styles.buttonGroup}>
        <Button
          title="Back to Dashboard"
          onPress={() => router.replace("/service/waiter-dashboard")}
        />
        {/* Optional: Place another order quickly */}
        <View style={{ marginTop: 12 }}>
          <Button
            title="Place Another Order"
            onPress={() => router.replace("/service/new-order")}
            color="#4CAF50"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6ffe6",
    padding: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    color: "#2e7d32",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonGroup: {
    width: "80%",
  },
});
