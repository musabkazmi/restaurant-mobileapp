import React, { useState } from "react";
import { View, Text, TextInput, Switch, Button, StyleSheet, ScrollView } from "react-native";
import axios from "../../utils/api"; // ✅ Ensure correct relative path to your API setup

export default function MenuEditor() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Food");
  const [available, setAvailable] = useState(true);
  const [vegan, setVegan] = useState(false);
  const [description, setDescription] = useState("");

 const handleAddItem = async () => {
  if (!name || !price || !category) {
    alert("Name, price and category are required.");
    return;
  }

  try {
    const response = await axios.post("/menu/add", {
      name,
      price: parseFloat(price),
      category,
      available,
      vegan,
      description,
      restaurant_id: 1 // 🔁 Replace with real restaurant ID later
    });

    if (response.data.success) {
      alert("Item added successfully!");
      setName("");
      setPrice("");
      setCategory("Food");
      setAvailable(true);
      setVegan(false);
      setDescription("");
    } else {
      alert("Failed to add item: " + response.data.message);
    }
  } catch (err) {
    console.error("API error:", err);
    alert("Something went wrong. Check console.");
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Menu Item</Text>

      <TextInput placeholder="Item Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Category (Food, Drink, Dessert)" value={category} onChangeText={setCategory} style={styles.input} />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Available</Text>
        <Switch value={available} onValueChange={setAvailable} />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Vegan</Text>
        <Switch value={vegan} onValueChange={setVegan} />
      </View>

      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.textarea} multiline />

      <Button title="Add Item" onPress={handleAddItem} color="#4CAF50" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#1e1e1e",
    flexGrow: 1,
    justifyContent: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  textarea: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    height: 80,
    textAlignVertical: "top",
    marginBottom: 10
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  label: {
    color: "#fff",
    flex: 1
  }
});
