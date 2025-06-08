// app/(auth)/dashboard.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Choose your panel</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/management')}>
        <Text style={styles.cardText}>👨‍💼 Manager</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/service')}>
        <Text style={styles.cardText}>🧑‍🍽️ Service</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/kitchen')}>
        <Text style={styles.cardText}>👨‍🍳 Kitchen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F1F', // dark gray
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#D1D5DB',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    backgroundColor: '#2E2E2E',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
