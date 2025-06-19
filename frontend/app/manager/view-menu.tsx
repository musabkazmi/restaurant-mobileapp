import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
import { BASE_URL } from "../../config";
import { router } from "expo-router";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  available: boolean;
  restaurant_id: number;
};

const ViewMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${BASE_URL}/menu/list`);
      const data = await response.json();
      const restaurantId = globalThis.restaurantId;

      if (restaurantId == null) {
        Alert.alert("Error", "Missing restaurant ID.");
        return;
      }

      const filteredItems = data.items.filter(
        (item: MenuItem) => item.restaurant_id === restaurantId
      );

      setMenuItems(filteredItems);
    } catch (error) {
      console.error("Error fetching menu:", error);
      Alert.alert("Error", "Could not fetch menu items.");
    }
  };

  const toggleAvailability = async (itemId: number, newStatus: boolean) => {
    try {
      const response = await fetch(`${BASE_URL}/menu/update/${itemId}`, {
        method: "PATCH", // PATCH is better for partial updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ available: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setMenuItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, available: newStatus } : item
          )
        );
      } else {
        Alert.alert("Update Failed", data.message || "Could not update item.");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      Alert.alert("Error", "Could not update availability.");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => router.back()} />

      <Text style={styles.title}>📋 Restaurant Menu</Text>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.name}>
              {item.name} - ₹{item.price}
            </Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Available:</Text>
              <Switch
                value={item.available}
                onValueChange={(val) => toggleAvailability(item.id, val)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ViewMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  itemCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    marginRight: 10,
    fontSize: 16,
  },
});
