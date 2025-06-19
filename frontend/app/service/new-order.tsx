// app/service/new-order.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { BASE_URL } from "../../config";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  restaurant_id: number;
};

export default function NewOrderScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${BASE_URL}/menu/list`);
      const data = await response.json();
      const restaurantId = globalThis.restaurantId;

      if (restaurantId == null) {
        Alert.alert("Error", "Missing restaurant ID.");
        return;
      }

      const filtered = data.items.filter(
        (item: MenuItem) => item.restaurant_id === restaurantId
      );
      setMenuItems(filtered);
    } catch (err) {
      console.error("❌ Fetch menu error:", err);
      Alert.alert("Error", "Failed to fetch menu.");
    }
  };

  const handleSubmit = async () => {
    const userId = globalThis.userId;
    const restaurantId = globalThis.restaurantId;

    if (!userId || !restaurantId) {
      Alert.alert("Error", "Missing user or restaurant ID.");
      return;
    }

    const items = Object.entries(quantities)
      .filter(([_, q]) => parseInt(q) > 0)
      .map(([id, q]) => ({
        menu_item_id: parseInt(id),
        quantity: parseInt(q),
      }));

    if (items.length === 0) {
      Alert.alert("Error", "Please select at least one item.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          user_id: userId,
          items,
        }),
      });

      const data = await response.json();
      console.log("🔄 Backend response:", data);

      if (data.success) {
        Alert.alert("✅ Success", "Order submitted!");
        setQuantities({});
        router.replace("/service/order-success");
      } else {
        Alert.alert("Error", data.message || "Failed to submit order.");
      }
    } catch (err) {
      console.error("❌ Submission error:", err);
      Alert.alert("Error", "Something went wrong while submitting the order.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>📝 New Order</Text>
      <Button title="Back" onPress={() => router.back()} />

      {menuItems.map((item) => (
        <View key={item.id} style={styles.itemBox}>
          <Text style={styles.itemName}>
            {item.name} - ₹{item.price.toFixed(2)}
          </Text>
          <TextInput
            placeholder="Qty"
            keyboardType="numeric"
            style={styles.input}
            value={quantities[item.id] || ""}
            onChangeText={(text) =>
              setQuantities({ ...quantities, [item.id]: text })
            }
          />
        </View>
      ))}

      {loading ? (
        <ActivityIndicator size="large" color="#007aff" style={{ marginTop: 16 }} />
      ) : (
        <Button title="Submit Order" onPress={handleSubmit} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  itemBox: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 8,
  },
  itemName: {
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    marginTop: 6,
    width: 80,
  },
});
