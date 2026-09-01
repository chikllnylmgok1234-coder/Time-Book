import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ChatsScreen from '../screens/home/ChatsScreen';
import CallsScreen from '../screens/home/CallsScreen';
import StatusScreen from '../screens/home/StatusScreen';
import ContactsScreen from '../screens/home/ContactsScreen';
import SettingsScreen from '../screens/home/SettingsScreen';
import ChatDetailScreen from '../screens/chat/ChatDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ChatsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#0FA573' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' }
    }}
  >
    <Stack.Screen
      name="ChatsList"
      component={ChatsScreen}
      options={{ title: 'Chats' }}
    />
    <Stack.Screen
      name="ChatDetail"
      component={ChatDetailScreen}
      options={({ route }) => ({ title: route.params?.name || 'Chat' })}
    />
  </Stack.Navigator>
);

const CallsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#0FA573' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' }
    }}
  >
    <Stack.Screen
      name="CallsList"
      component={CallsScreen}
      options={{ title: 'Calls' }}
    />
  </Stack.Navigator>
);

const StatusStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#0FA573' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' }
    }}
  >
    <Stack.Screen
      name="StatusList"
      component={StatusScreen}
      options={{ title: 'Status' }}
    />
  </Stack.Navigator>
);

const ContactsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#0FA573' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' }
    }}
  >
    <Stack.Screen
      name="ContactsList"
      component={ContactsScreen}
      options={{ title: 'Contacts' }}
    />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#0FA573' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' }
    }}
  >
    <Stack.Screen
      name="SettingsList"
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Stack.Navigator>
);

const HomeNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Chats') {
          iconName = focused ? 'chat' : 'chat-outline';
        } else if (route.name === 'Calls') {
          iconName = focused ? 'phone' : 'phone-outline';
        } else if (route.name === 'Status') {
          iconName = focused ? 'circle-slice-8' : 'circle-outline';
        } else if (route.name === 'Contacts') {
          iconName = focused ? 'contacts' : 'contacts';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'cog' : 'cog-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#0FA573',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        borderTopColor: '#e0e0e0',
        paddingBottom: 5,
        paddingTop: 5
      }
    })}
  >
    <Tab.Screen name="Chats" component={ChatsStack} options={{ title: 'Chats' }} />
    <Tab.Screen name="Calls" component={CallsStack} options={{ title: 'Calls' }} />
    <Tab.Screen name="Status" component={StatusStack} options={{ title: 'Status' }} />
    <Tab.Screen name="Contacts" component={ContactsStack} options={{ title: 'Contacts' }} />
    <Tab.Screen name="Settings" component={SettingsStack} options={{ title: 'Settings' }} />
  </Tab.Navigator>
);

export default HomeNavigator;
