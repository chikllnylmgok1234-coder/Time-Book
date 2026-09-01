import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const screens = [
    {
      title: 'Connect with everyone',
      description: 'Stay connected with friends and family around the world'
    },
    {
      title: 'Chat, call and share',
      description: 'Send messages, make voice and video calls, share media'
    },
    {
      title: 'Your conversations, your privacy',
      description: 'Your data is secure and private'
    }
  ];

  const handleNext = async () => {
    if (currentPage < screens.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.replace('PhoneNumber');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('PhoneNumber');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{screens[currentPage].title}</Text>
        <Text style={styles.description}>
          {screens[currentPage].description}
        </Text>

        <View style={styles.dotsContainer}>
          {screens.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index && styles.activeDot
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleNext}
        >
          <Text style={styles.continueText}>
            {currentPage === screens.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000'
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd'
  },
  activeDot: {
    backgroundColor: '#0FA573',
    width: 24
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10
  },
  skipButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0FA573',
    justifyContent: 'center',
    alignItems: 'center'
  },
  skipText: {
    color: '#0FA573',
    fontSize: 16,
    fontWeight: '600'
  },
  continueButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#0FA573',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default OnboardingScreen;
