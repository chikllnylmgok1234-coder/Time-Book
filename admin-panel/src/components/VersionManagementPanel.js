import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const VersionManagementPanel = ({ adminToken }) => {
  const [versions, setVersions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    version: '',
    buildNumber: '',
    downloadUrl: '',
    platform: 'android',
    fileSize: '',
    isForceUpdate: false,
    changeLog: ''
  });

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const response = await axios.get(`${API_URL}/updates/admin/all`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setVersions(response.data.versions);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch versions');
    }
  };

  const handleCreateVersion = async () => {
    try {
      if (!formData.version || !formData.buildNumber || !formData.downloadUrl) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      const response = await axios.post(
        `${API_URL}/updates/admin/create`,
        {
          ...formData,
          buildNumber: parseInt(formData.buildNumber),
          fileSize: parseInt(formData.fileSize),
          changeLog: formData.changeLog.split('\n').filter(x => x.trim())
        },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );

      Alert.alert('Success', `Version ${formData.version} created!`);
      setFormData({
        version: '',
        buildNumber: '',
        downloadUrl: '',
        platform: 'android',
        fileSize: '',
        isForceUpdate: false,
        changeLog: ''
      });
      setShowForm(false);
      fetchVersions();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create version');
    }
  };

  const handlePublishVersion = async (versionId) => {
    try {
      await axios.post(
        `${API_URL}/updates/admin/${versionId}/publish`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      Alert.alert('Success', 'Version published!');
      fetchVersions();
    } catch (err) {
      Alert.alert('Error', 'Failed to publish version');
    }
  };

  const handleSetForceUpdate = async (versionId) => {
    try {
      await axios.post(
        `${API_URL}/updates/admin/${versionId}/force-update`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      Alert.alert('Success', 'Force update enabled!');
      fetchVersions();
    } catch (err) {
      Alert.alert('Error', 'Failed to set force update');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📱 Version Management</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={styles.addButtonText}>
          {showForm ? 'Cancel' : '+ Create New Version'}
        </Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Version (e.g., 1.0.1)"
            value={formData.version}
            onChangeText={(text) => setFormData({ ...formData, version: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Build Number"
            keyboardType="number-pad"
            value={formData.buildNumber}
            onChangeText={(text) => setFormData({ ...formData, buildNumber: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Download URL"
            value={formData.downloadUrl}
            onChangeText={(text) => setFormData({ ...formData, downloadUrl: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="File Size (bytes)"
            keyboardType="number-pad"
            value={formData.fileSize}
            onChangeText={(text) => setFormData({ ...formData, fileSize: text })}
          />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Change Log (one per line)"
            multiline
            value={formData.changeLog}
            onChangeText={(text) => setFormData({ ...formData, changeLog: text })}
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateVersion}
          >
            <Text style={styles.createButtonText}>Create Version</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.versionsList}>
        {versions.map((version) => (
          <View key={version._id} style={styles.versionCard}>
            <View style={styles.versionHeader}>
              <Text style={styles.versionNumber}>
                v{version.version} (Build {version.buildNumber})
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: version.status === 'published' ? '#28a745' : '#ffc107' }
              ]}>
                <Text style={styles.statusText}>{version.status}</Text>
              </View>
            </View>

            {version.changeLog && version.changeLog.length > 0 && (
              <View style={styles.changeLog}>
                {version.changeLog.map((log, idx) => (
                  <Text key={idx} style={styles.changeLogItem}>• {log}</Text>
                ))}
              </View>
            )}

            <Text style={styles.metaInfo}>
              📦 Size: {(version.fileSize / 1024 / 1024).toFixed(2)} MB | 📥 Downloads: {version.downloadCount}
            </Text>

            <View style={styles.actionButtons}>
              {version.status === 'draft' && (
                <TouchableOpacity
                  style={styles.publishBtn}
                  onPress={() => handlePublishVersion(version._id)}
                >
                  <Text style={styles.btnText}>✅ Publish</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.forceBtn, version.isForceUpdate && { backgroundColor: '#dc3545' }]}
                onPress={() => handleSetForceUpdate(version._id)}
              >
                <Text style={styles.btnText}>
                  {version.isForceUpdate ? '⚠️ Force' : '🔄 Force Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000'
  },
  addButton: {
    backgroundColor: '#0FA573',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  form: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 14
  },
  createButton: {
    backgroundColor: '#0FA573',
    padding: 12,
    borderRadius: 6
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  versionsList: {
    gap: 12
  },
  versionCard: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  versionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  changeLog: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10
  },
  changeLogItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  metaInfo: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8
  },
  publishBtn: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 6
  },
  forceBtn: {
    flex: 1,
    backgroundColor: '#ffc107',
    padding: 8,
    borderRadius: 6
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export default VersionManagementPanel;
