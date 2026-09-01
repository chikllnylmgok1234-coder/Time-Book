import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';

const PhoneNumberScreen = ({ navigation }) => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/request-otp`, {
        phoneNumber: countryCode + phoneNumber,
        countryCode
      });

      if (response.data.success) {
        navigation.navigate('OTP', {
          phoneNumber: countryCode + phoneNumber
        });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="clock" size={80} color="#0FA573" />
          <Text style={styles.title}>Time Book</Text>
          <Text style={styles.subtitle}>Enter Your Phone Number</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeInput}>
              <TextInput
                style={styles.countryCodeText}
                value={countryCode}
                editable={false}
              />
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="10 digit number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholderTextColor="#ccc"
            />
          </View>

          <Text style={styles.note}>
            We'll send you a verification code to this number
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.button,
          !phoneNumber || phoneNumber.length < 10 ? styles.buttonDisabled : {}
        ]}
        onPress={handleRequestOTP}
        disabled={loading || !phoneNumber || phoneNumber.length < 10}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40
  },
  header: {
    alignItems: 'center',
    marginBottom: 50
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8
  },
  form: {
    marginBottom: 20
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  countryCodeInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'flex-end',
    paddingBottom: 10
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    width: 60
  },
  phoneInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
    paddingBottom: 10,
    color: '#000'
  },
  note: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#0FA573',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default PhoneNumberScreen;
