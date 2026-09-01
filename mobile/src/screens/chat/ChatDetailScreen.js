import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const ChatDetailScreen = ({ route }) => {
  const { name } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <Text>Chat with {name}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default ChatDetailScreen;
