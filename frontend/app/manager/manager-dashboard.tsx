import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ManagerDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👔 Manager Dashboard</Text>

      <View style={styles.button}>
        <Button
          title="Edit Menu"
          onPress={() => router.push("/manager/menu-editor")}
        />
      </View>

      {/* Add more buttons for other manager features later */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#333"
  },
  title: {
    fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 24
  },
  button: {
    width: "60%", marginVertical: 10
  },
});
