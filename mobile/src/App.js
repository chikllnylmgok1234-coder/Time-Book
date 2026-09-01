import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import store from './src/store';

// Screens
import SplashScreen from './src/screens/auth/SplashScreen';
import OnboardingScreen from './src/screens/auth/OnboardingScreen';
import PhoneNumberScreen from './src/screens/auth/PhoneNumberScreen';
import OTPScreen from './src/screens/auth/OTPScreen';
import ProfileSetupScreen from './src/screens/auth/ProfileSetupScreen';
import HomeNavigator from './src/navigation/HomeNavigator';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = React.useState(false);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const onboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        
        setUserToken(token);
        setHasSeenOnboarding(onboarding === 'true');
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0FA573" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
            gestureEnabled: false
          }}
        >
          {!userToken ? (
            <>
              <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ animationEnabled: false }}
              />
              {!hasSeenOnboarding && (
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              )}
              <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
              <Stack.Screen name="OTP" component={OTPScreen} />
              <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            </>
          ) : (
            <Stack.Screen name="Home" component={HomeNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
