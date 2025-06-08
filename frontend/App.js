import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import API from './utils/api';

export default function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    API.get('/')
      .then(res => setMessage(res.data.message))
      .catch(err => {
        console.error(err);
        setMessage('Error connecting to backend');
      });
  }, []);

  return (
    <View style={{ padding: 30 }}>
      <Text style={{ fontSize: 18 }}>{message}</Text>
    </View>
  );
}
