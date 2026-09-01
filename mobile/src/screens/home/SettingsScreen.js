import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'sessionToken']);
    navigation.replace('PhoneNumber');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="account" size={24} color="#0FA573" />
          <Text style={styles.settingText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Icon name="lock" size={24} color="#0FA573" />
          <Text style={styles.settingText}>Privacy & Security</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Icon name="bell" size={24} color="#0FA573" />
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Icon name="palette" size={24} color="#0FA573" />
          <Text style={styles.settingText}>Appearance</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="help" size={24} color="#0FA573" />
          <Text style={styles.settingText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Icon name="information" size={24} color="#0FA573" />
          <Text style={styles.settingText}>About</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16
  },
  section: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  settingText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500'
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ff4444',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default SettingsScreen;
