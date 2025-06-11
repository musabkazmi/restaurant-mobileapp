import { useRouter } from "expo-router";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import API from "../../utils/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { email, password });
      const { role } = res.data;

      // 🔁 Redirect based on role
     if (role === "manager") {
  router.replace("/manager/manager-dashboard");
} else if (role === "waiter") {
  router.replace("/service/waiter-dashboard");
} else if (role === "kitchen") {
  router.replace("/kitchen/kitchen-dashboard");
} else {
  Alert.alert("Unknown role");
}


    } catch (err) {
      Alert.alert("Login Failed", "Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
});
