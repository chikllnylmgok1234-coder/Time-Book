import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

const ChatsScreen = () => {
  const [chats, setChats] = React.useState([]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>
      {chats.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No chats yet</Text>
          <Text style={styles.emptySubtext}>Start a new conversation</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={({ item }) => <Text>{item.name}</Text>}
          keyExtractor={item => item.id}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000'
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

export default ChatsScreen;
