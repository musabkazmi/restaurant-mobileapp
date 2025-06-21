import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import { BASE_URL } from "../../config";
import { router } from "expo-router";

type OrderItem = {
  menu_item_id: number;
  name: string;
  quantity: number;
};

type Order = {
  id: number;
  created_by: number;
  items: OrderItem[];
  status: string;
};

export default function ViewOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const restaurantId = globalThis.restaurantId;
    if (!restaurantId) {
      Alert.alert("Error", "Missing restaurant ID.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/order/list?restaurant_id=${restaurantId}`);
      const data = await res.json();
      if (data.success) {
        // Show only pending/in_process
        const activeOrders = data.orders.filter((order: Order) =>
          ["pending", "in_process"].includes(order.status)
        );
        setOrders(activeOrders);
      } else {
        Alert.alert("Error", data.message || "Failed to load orders.");
      }
    } catch {
      Alert.alert("Error", "Network error while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (orderId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/order/update-status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "completed" }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", `Order #${orderId} marked as completed.`);
        fetchOrders(); // Refresh
      } else {
        Alert.alert("Error", data.message || "Failed to update order.");
      }
    } catch (err) {
      Alert.alert("Error", "Could not update order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="⬅️ Back" onPress={() => router.back()} />

      <Text style={styles.title}>🍽 Incoming Orders</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : orders.length === 0 ? (
        <Text style={styles.noOrders}>No active orders.</Text>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.orderBox}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text>Status: {order.status}</Text>
            <Text>Waiter ID: {order.created_by}</Text>
            {order.items.map((item, index) => (
              <Text key={index} style={styles.itemText}>
                {item.name} × {item.quantity}
              </Text>
            ))}
            <Button
              title="✅ Mark as Completed"
              onPress={() => markCompleted(order.id)}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  noOrders: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  orderBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    backgroundColor: "#f8f8f8",
  },
  orderId: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemText: {
    marginLeft: 8,
  },
});
