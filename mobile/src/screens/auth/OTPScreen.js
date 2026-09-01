import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5000/api';

const OTPScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Invalid', 'Please enter 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        phoneNumber,
        otp: otpCode
      });

      if (response.data.success) {
        await AsyncStorage.setItem('sessionToken', response.data.sessionToken);

        if (response.data.isNewUser) {
          navigation.navigate('ProfileSetup', {
            phoneNumber,
            sessionToken: response.data.sessionToken
          });
        } else {
          await AsyncStorage.setItem('accessToken', response.data.accessToken);
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
          navigation.replace('Home');
        }
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Your Number</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to {phoneNumber}
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={value => handleOtpChange(value, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                handleBackspace(index);
              }
            }}
            keyboardType="numeric"
            maxLength={1}
            selectionColor="#0FA573"
          />
        ))}
      </View>

      <View style={styles.timerContainer}>
        {timer > 0 ? (
          <Text style={styles.timerText}>
            Resend code in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </Text>
        ) : (
          <TouchableOpacity onPress={() => {
            setTimer(120);
            setOtp(['', '', '', '', '', '']);
          }}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerifyOTP}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Verifying...' : 'Verify'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20
  },
  header: {
    marginTop: 40,
    marginBottom: 50,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0FA573'
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30
  },
  timerText: {
    fontSize: 14,
    color: '#666'
  },
  resendText: {
    fontSize: 14,
    color: '#0FA573',
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#0FA573',
    paddingVertical: 16,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default OTPScreen;
