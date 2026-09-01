import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config/constants';

const UpdateChecker = ({ currentVersion, platform = 'android' }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkForUpdates();
    // Check every 6 hours
    const interval = setInterval(checkForUpdates, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkForUpdates = async () => {
    try {
      const response = await axios.get(`${API_URL}/updates/latest`, {
        params: {
          platform,
          currentVersion
        }
      });

      if (response.data.updateAvailable) {
        setUpdateData(response.data);
        setUpdateAvailable(true);
        await AsyncStorage.setItem('updateAvailable', 'true');
      }
    } catch (err) {
      console.error('Update check error:', err);
    } finally {
      setChecking(false);
    }
  };

  const handleUpdate = async () => {
    if (!updateData) return;

    try {
      // Log download
      await axios.post(`${API_URL}/updates/${updateData.versionId}/download`);

      // Open download URL (in production, use linking.openURL)
      Alert.alert(
        'Downloading Update',
        `Downloading Time Book ${updateData.latestVersion}...`,
        [{ text: 'OK' }]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to download update');
    }
  };

  const handleLater = () => {
    setUpdateAvailable(false);
  };

  if (!updateAvailable || !updateData) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={updateAvailable}
    >
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>Update Available</Text>

          <Text style={styles.version}>
            Version {updateData.latestVersion} is available
          </Text>

          {updateData.changeLog && updateData.changeLog.length > 0 && (
            <View style={styles.changeLogContainer}>
              <Text style={styles.changeLogTitle}>What's New:</Text>
              {updateData.changeLog.map((log, index) => (
                <Text key={index} style={styles.changeLogItem}>
                  • {log}
                </Text>
              ))}
            </View>
          )}

          {updateData.fileSize && (
            <Text style={styles.fileSize}>
              File size: {(updateData.fileSize / 1024 / 1024).toFixed(2)} MB
            </Text>
          )}

          {updateData.isForceUpdate && (
            <View style={styles.forceUpdateNotice}>
              <Text style={styles.forceUpdateText}>
                ⚠️ This update is required to continue using Time Book
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            {!updateData.isForceUpdate && (
              <TouchableOpacity
                style={styles.laterButton}
                onPress={handleLater}
              >
                <Text style={styles.laterButtonText}>Later</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
            >
              <Text style={styles.updateButtonText}>
                {updateData.isForceUpdate ? 'Update Now' : 'Update'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center'
  },
  version: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16
  },
  changeLogContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    maxHeight: 150
  },
  changeLogTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8
  },
  changeLogItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16
  },
  fileSize: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 12
  },
  forceUpdateNotice: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107'
  },
  forceUpdateText: {
    fontSize: 13,
    color: '#856404',
    fontWeight: '500'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end'
  },
  laterButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0FA573'
  },
  laterButtonText: {
    color: '#0FA573',
    fontSize: 14,
    fontWeight: '600'
  },
  updateButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#0FA573',
    borderRadius: 8
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  }
});

export default UpdateChecker;
