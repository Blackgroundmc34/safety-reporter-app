import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

// IMPORTANT: Double-check that this IP address is still correct for your server.
const API_BASE_URL = 'http://192.168.6.152/safety_api'; // :contentReference[oaicite:2]{index=2}

export default function ReportScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [photo, setPhoto] = useState(null);

  // Departments (from API)
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isLoadingDepts, setIsLoadingDepts] = useState(true);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hardcoded severity list (as requested)
  const severityLevels = ['High', 'Medium', 'Low']; // picker kept simple:contentReference[oaicite:3]{index=3}

  useEffect(() => {
    const fetchDepartments = async () => {
      console.log("Attempting to fetch departments from:", `${API_BASE_URL}/get_departments.php`);
      setIsLoadingDepts(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/get_departments.php`);
        console.log("Server Response Data:", JSON.stringify(response.data, null, 2));
        if (response.data.success && Array.isArray(response.data.departments)) {
          setDepartments(response.data.departments);
          console.log("Successfully loaded departments.");
        } else {
          Alert.alert("Data Error", "Could not load departments list. The server response was invalid.");
          console.error("Invalid data format received from server:", response.data);
        }
      } catch (error) {
        console.error("Fetch departments network error:", error);
        Alert.alert("Network Error", `Unable to connect to the server. Please check your network and the server IP address. Details: ${error.message}`);
      } finally {
        setIsLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, []);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  // ---- SUBMIT TO incidents VIA report.php ----
  const handleSubmit = async () => {
    if (!title || !location || !selectedDepartment) {
      Alert.alert('Missing Information', 'Please fill in the Title, Location, and select a Department.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Build multipart/form-data for PHP
      const form = new FormData();

      // Required by `incidents` table:contentReference[oaicite:4]{index=4}
      form.append('user_id', String(user?.id ?? '')); // adjust if your AuthContext uses a different field
      form.append('department_id', String(selectedDepartment)); // departments API returns id as string
      form.append('title', title.trim());
      form.append('description', description.trim());
      form.append('location', location.trim());
      form.append('severity', severity); // High/Medium/Low

      // incident_time is NOT NULL in schema:contentReference[oaicite:5]{index=5} — let server set NOW(),
      // but if your report.php expects it from client, uncomment the next line:
      // form.append('incident_time', new Date().toISOString().slice(0, 19).replace('T', ' '));

      // Optional photo
      if (photo?.uri) {
        const uriParts = photo.uri.split('.');
        const ext = uriParts[uriParts.length - 1]?.toLowerCase() || 'jpg';
        form.append('photo', {
          uri: photo.uri,
          name: `incident_${Date.now()}.${ext}`,
          type: ext === 'png' ? 'image/png' : 'image/jpeg',
        });
      }

      // POST to your PHP endpoint
      const response = await axios.post(`${API_BASE_URL}/report.php`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 20000,
      });

      console.log('Submit response:', response?.data);

      // EXPECTED: { success: true, incident_id, message }
      if (response?.data?.success) {
        const newId = response?.data?.incident_id;
        Alert.alert('Submitted', `Report created${newId ? ` (#${newId})` : ''}.`);
        // Reset form
        setTitle('');
        setDescription('');
        setLocation('');
        setSeverity('Medium');
        setSelectedDepartment(null);
        setPhoto(null);

        // Optional: navigate to history or detail screen
        // navigation.navigate('History');
      } else {
        const serverMsg = response?.data?.message || 'Server did not accept the report.';
        Alert.alert('Not Submitted', serverMsg);
      }
    } catch (err) {
      console.error('Submit error:', err);
      Alert.alert(
        'Network Error',
        `Could not submit report. Check your server and connection.\nDetails: ${err.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.pageHeader}>
          <MaterialCommunityIcons name="alert-decagram-outline" size={48} color={theme.primary} />
          <Text style={styles.pageTitle}>New Incident Report</Text>
          <Text style={styles.pageDescription}>Your report helps improve safety for everyone. Please provide as much detail as possible.</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Incident Title */}
          <Text style={styles.label}>Incident Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Trip Hazard Near Conveyor"
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
          />

          {/* Location */}
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Zone 5, Crusher Area"
            placeholderTextColor="#666"
            value={location}
            onChangeText={setLocation}
          />

          {/* Department (from database) */}
          <Text style={styles.label}>Department</Text>
          <View style={styles.pickerContainer}>
            {isLoadingDepts ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={theme.primary} />
                <Text style={styles.loadingText}>Loading Departments...</Text>
              </View>
            ) : (
              <Picker
                selectedValue={selectedDepartment}
                onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                dropdownIconColor={theme.text}
              >
                <Picker.Item label="-- Select a Department --" value={null} />
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <Picker.Item key={String(dept.id)} label={dept.name} value={dept.id} />
                  ))
                ) : (
                  <Picker.Item label="No departments found" value={null} enabled={false} />
                )}
              </Picker>
            )}
          </View>

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add more details here..."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Severity (hardcoded H/M/L only) */}
          <Text style={styles.label}>Severity</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={severity}
              onValueChange={(itemValue) => setSeverity(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              dropdownIconColor={theme.text}
            >
              {severityLevels.map((level) => (
                <Picker.Item key={level} label={level} value={level} />
              ))}
            </Picker>
          </View>

          {/* Photo */}
          <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
            <MaterialCommunityIcons name="camera" size={20} color="#fff" />
            <Text style={styles.photoButtonText}>{photo ? 'Retake Photo' : 'Add Photo'}</Text>
          </TouchableOpacity>
          {photo && <Image source={{ uri: photo.uri }} style={styles.imagePreview} />}

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting…' : 'Submit Report'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const createStyles = (theme) => {
  const isIOS = Platform.OS === 'ios';
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    pageHeader: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 30, borderBottomWidth: 1, borderBottomColor: theme.card },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginTop: 15, textAlign: 'center' },
    pageDescription: { fontSize: 15, color: theme.textSecondary, textAlign: 'center', marginTop: 8 },
    formContainer: { padding: 20, paddingTop: 10 },
    label: { fontSize: 16, fontWeight: '600', color: theme.textSecondary, marginBottom: 8, marginLeft: 5 },
    input: { backgroundColor: theme.card, color: theme.text, paddingHorizontal: 15, paddingVertical: 15, borderRadius: 12, marginBottom: 20, fontSize: 16, borderWidth: 1, borderColor: theme.border },
    pickerContainer: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: isIOS ? 0 : 8,
      paddingVertical: isIOS ? 6 : 0,
      minHeight: isIOS ? 200 : 55,
      justifyContent: isIOS ? 'center' : 'flex-start',
    },
    picker: {
      color: theme.text,
      height: isIOS ? 190 : 55,
      width: '100%',
    },
    pickerItem: { color: theme.text, fontSize: 18 },
    textArea: { height: 120, textAlignVertical: 'top' },
    loadingContainer: { flexDirection: 'row', alignItems: 'center', height: 55, paddingLeft: 15 },
    loadingText: { color: theme.textSecondary, marginLeft: 10 },
    photoButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary, padding: 15, borderRadius: 12, marginBottom: 15 },
    photoButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
    imagePreview: { width: '100%', height: 200, borderRadius: 12, marginBottom: 20, alignSelf: 'center' },
    submitButton: { backgroundColor: '#34C759', padding: 18, borderRadius: 12, alignItems: 'center' },
    submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  });
};
