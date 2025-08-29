import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert, Platform, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Network from 'expo-network';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth
import { useTheme } from '../context/ThemeContext'; // <-- Import useTheme for styling

// IMPORTANT: Use your computer's IP address here
const API_BASE_URL = 'http://172.20.10.3/safety_api';
const STORAGE_KEY = '@offline_reports';

export default function ReportScreen({ navigation }) {
  const { user } = useAuth(); // <-- Get the logged-in user from context
  const { theme } = useTheme(); // <-- Get theme for styles
  const styles = createStyles(theme); // <-- Create styles dynamically

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [photo, setPhoto] = useState(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !location) {
      Alert.alert('Error', 'Title and Location are required.');
      return;
    }
    
    // The report object now includes the user's ID
    const report = {
      id: Date.now(), // Local ID for offline key
      user_id: user.id, // The ID of the logged-in user
      title,
      description,
      location,
      severity,
      photoUri: photo ? photo.uri : null,
      // Format date for MySQL DATETIME type
      incident_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    const networkState = await Network.getNetworkStateAsync();
    if (networkState.isConnected) {
      const result = await sendReportToServer(report);
      if (result.success) {
        // We get the success message from the server now
        Alert.alert('Success', result.message, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
        resetForm();
      } else {
         Alert.alert('Sync Failed', result.message || 'Could not send to server. Saving report offline.');
         saveReportOffline(report);
      }
    } else {
      Alert.alert('Offline', 'No internet connection. Report saved locally.',[
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      saveReportOffline(report);
    }
  };

  const saveReportOffline = async (report) => {
    try {
      const existingReports = await AsyncStorage.getItem(STORAGE_KEY);
      const reports = existingReports ? JSON.parse(existingReports) : [];
      reports.push(report);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      resetForm();
    } catch (e) {
      Alert.alert('Storage Error', 'Failed to save report locally.');
    }
  };

  const sendReportToServer = async (report) => {
    const formData = new FormData();
    // Append all fields from the report object to the formData
    Object.keys(report).forEach(key => {
        if (key === 'photoUri' && report.photoUri) {
            const uriParts = report.photoUri.split('.');
            const fileType = uriParts[uriParts.length - 1];
            formData.append('photo', {
              uri: report.photoUri,
              name: `photo_${report.id}.${fileType}`,
              type: `image/${fileType}`,
            });
        } else if (key !== 'id' && key !== 'photoUri') { // Don't send local-only fields
            formData.append(key, report[key]);
        }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/report.php`, { 
          method: 'POST', 
          body: formData, 
          headers: { 'Content-Type': 'multipart/form-data' } 
      });
      const result = await response.json();
      // Return the whole result object { success, message }
      return result;
    } catch (error) {
      console.error("Error sending report:", error);
      return { success: false, message: 'An error occurred connecting to the server.' };
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setSeverity('Medium');
    setPhoto(null);
  };

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView>
            <View style={styles.pageHeader}>
                <MaterialCommunityIcons name="alert-decagram-outline" size={48} color={theme.primary} />
                <Text style={styles.pageTitle}>New Incident Report</Text>
                <Text style={styles.pageDescription}>Your report helps improve safety for everyone. Please provide as much detail as possible.</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>Incident Title</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="e.g., Trip Hazard Near Conveyor" 
                    placeholderTextColor="#666"
                    value={title} 
                    onChangeText={setTitle} 
                />

                <Text style={styles.label}>Location</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="e.g., Zone 5, Crusher Area" 
                    placeholderTextColor="#666"
                    value={location} 
                    onChangeText={setLocation} 
                />
                
                <Text style={styles.label}>Description</Text>
                <TextInput 
                    style={[styles.input, styles.textArea]} 
                    placeholder="Add more details here..." 
                    placeholderTextColor="#666"
                    value={description} 
                    onChangeText={setDescription} 
                    multiline 
                />

                <Text style={styles.label}>Severity</Text>
                <TextInput 
                    style={styles.input} 
                    value={severity} 
                    onChangeText={setSeverity} 
                />

                <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                    <MaterialCommunityIcons name="camera" size={20} color="#fff" />
                    <Text style={styles.photoButtonText}>{photo ? 'Retake Photo' : 'Add Photo'}</Text>
                </TouchableOpacity>

                {photo && (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: photo.uri }} style={styles.imagePreview} />
                    </View>
                )}

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

// The stylesheet is now a function that accepts the theme object
const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  pageHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: theme.card,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    marginTop: 15,
    textAlign: 'center',
  },
  pageDescription: {
    fontSize: 15,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  formContainer: {
    padding: 20,
    paddingTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: theme.card,
    color: theme.text,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: '#34C759', // A vibrant green for the final submit action
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});