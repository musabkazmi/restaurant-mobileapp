import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { BASE_URL } from "../../config";
import { router } from "expo-router";

type Message = {
  sender: 'manager' | 'ai';
  text: string;
};

export default function AIAgentScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage: Message = { sender: 'manager', text: question };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/ai/chat`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer secret-manager-ai-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          user_id: globalThis.userId
        })
      });

      const data = await response.json();
      const aiMessage: Message = {
        sender: 'ai',
        text: data.answer || 'No answer received from AI.'
      };

      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      setMessages([...newMessages, {
        sender: 'ai',
        text: '⚠️ Error talking to AI agent.'
      }]);
    }

    setLoading(false);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.heading}>🧠 Ask the AI Agent</Text>
      <Button title="Back" onPress={() => router.back()} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatBox}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
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
    </KeyboardAvoidingView>
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
    marginBottom: 8,
    textAlign: 'center',
  },
  chatBox: {
    flex: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  messageBubble: {
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    maxWidth: '80%',
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
