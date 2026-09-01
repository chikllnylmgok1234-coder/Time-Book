import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const StatusScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No status updates</Text>
        <Text style={styles.emptySubtext}>Create a status to share with contacts</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999'
  }
});

export default StatusScreen;
