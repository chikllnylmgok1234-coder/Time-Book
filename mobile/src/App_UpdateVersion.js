import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import UpdateChecker from './src/components/UpdateChecker';
import HomeNavigator from './src/navigation/HomeNavigator';

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);
  const currentAppVersion = '1.0.0'; // Update this with your actual version

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Load user token
        const token = await AsyncStorage.getItem('accessToken');
        setUserToken(token);
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
    <>
      <UpdateChecker 
        currentVersion={currentAppVersion} 
        platform="android"
      />
      {userToken ? <HomeNavigator /> : <AuthNavigator />}
    </>
  );
};

export default App;
