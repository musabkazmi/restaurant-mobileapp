import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

type Message = {
  sender: 'manager' | 'ai';
  text: string;
};

export default function AIAgentScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage: Message = { sender: 'manager', text: question };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch('http://192.168.2.59:5000/ai/chat', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Authorization': 'Bearer secret-manager-ai-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      });

      const data = await response.json();

      const aiMessage: Message = {
        sender: 'ai',
        text: data.answer || 'No answer received from AI.'
      };

      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: 'ai',
        text: 'Error talking to AI agent.'
      };
      setMessages([...newMessages, errorMessage]);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ask the AI Agent</Text>

      <ScrollView style={styles.chatBox}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.sender === 'manager' ? styles.managerBubble : styles.aiBubble
            ]}
          >
            <Text style={styles.messageSender}>{msg.sender.toUpperCase()}</Text>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <TextInput
        placeholder="Type your question..."
        placeholderTextColor="#aaa"
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#00ffcc" style={{ marginTop: 10 }} />
      ) : (
        <Button title="Send" onPress={handleSend} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    padding: 16,
    paddingTop: 48,
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  chatBox: {
    flex: 1,
    marginBottom: 12,
  },
  messageBubble: {
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
  },
  managerBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007aff',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#444',
  },
  messageSender: {
    fontSize: 10,
    color: '#ccc',
    marginBottom: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
});
