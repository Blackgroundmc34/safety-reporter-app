import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// --- CORRECTED IP ADDRESS ---
// Ensure this is the correct IP address for your computer running the server.
const API_BASE_URL = 'https://www.masilelamc.co.za/safety_api';

export default function TechnicianTasksScreen() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // This is the corrected useFocusEffect hook
    useFocusEffect(
        React.useCallback(() => {
            // Define the async function to fetch data inside the callback
            const fetchTasks = async () => {
                if (!user) {
                    setIsLoading(false);
                    return;
                }
                setIsLoading(true);
                try {
                    const response = await axios.get(`${API_BASE_URL}/get_technician_tasks.php?technician_id=${user.id}`);
                    if (response.data.success) {
                        setTasks(response.data.tasks);
                    } else {
                        Alert.alert("Error", response.data.message || "Could not fetch tasks.");
                    }
                } catch (error) {
                    Alert.alert("Network Error", "Unable to connect to the server. Please check the IP Address.");
                    console.error("Fetch tasks error:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            // Call the async function
            fetchTasks();

            // Return an empty cleanup function as required by the hook
            return () => {};
        }, [user]) // Dependency array: re-run the effect if the user object changes
    );

    const handleStatusUpdate = async (incidentId, newStatus) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/update_incident_status.php`, {
                incident_id: incidentId,
                new_status: newStatus,
            });
            if (response.data.success) {
                Alert.alert("Success", "Status updated successfully.");
                // Manually trigger a refresh after status update
                const refreshTasks = async () => {
                    if (!user) return;
                    setIsLoading(true);
                    const response = await axios.get(`${API_BASE_URL}/get_technician_tasks.php?technician_id=${user.id}`);
                    if (response.data.success) setTasks(response.data.tasks);
                    setIsLoading(false);
                };
                refreshTasks();
            } else {
                Alert.alert("Update Failed", response.data.message);
            }
        } catch (error) {
            Alert.alert("Network Error", "Could not update status.");
        }
    };

    const renderTaskActions = (item) => {
        switch (item.status) {
            case 'Assigned':
                return (
                    <TouchableOpacity style={[styles.actionButton, styles.startButton]} onPress={() => handleStatusUpdate(item.id, 'In Progress')}>
                        <Text style={styles.actionButtonText}>Start Work</Text>
                    </TouchableOpacity>
                );
            case 'In Progress':
                return (
                    <TouchableOpacity style={[styles.actionButton, styles.resolveButton]} onPress={() => handleStatusUpdate(item.id, 'Pending Review')}>
                        <Text style={styles.actionButtonText}>Mark as Resolved</Text>
                    </TouchableOpacity>
                );
            default:
                return <Text style={styles.noActionsText}>No actions available</Text>;
        }
    };

    const renderTask = ({ item }) => (
        <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskLocation}>{item.location}</Text>
            <View style={styles.separator} />
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reported By:</Text>
                <Text style={styles.detailValue}>{item.reported_by}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, { color: getStatusColor(item.status, theme) }]}>{item.status}</Text>
            </View>
            <View style={styles.actionsContainer}>
                {renderTaskActions(item)}
            </View>
        </View>
    );
    
    if (isLoading && tasks.length === 0) {
        return <View style={styles.centered}><ActivityIndicator size="large" color={theme.primary} /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={tasks}
                renderItem={renderTask}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={<View style={styles.centered}><Text style={styles.emptyText}>You have no assigned tasks.</Text></View>}
                // The onRefresh prop is not strictly needed with useFocusEffect but is good for manual pulls
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => {
                     const refreshTasks = async () => {
                        if (!user) return;
                        setIsLoading(true);
                        const response = await axios.get(`${API_BASE_URL}/get_technician_tasks.php?technician_id=${user.id}`);
                        if (response.data.success) setTasks(response.data.tasks);
                        setIsLoading(false);
                    };
                    refreshTasks();
                }} tintColor={theme.text} />}
            />
        </SafeAreaView>
    );
}

const getStatusColor = (status, theme) => {
    const colors = {
        Assigned: '#3498db',
        'In Progress': '#f1c40f',
        'Pending Review': '#9b59b6',
        Completed: '#2ecc71',
        Rejected: '#e74c3c',
    };
    return colors[status] || theme.textSecondary;
};

const createStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    taskCard: { backgroundColor: theme.card, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: theme.border },
    taskTitle: { color: theme.text, fontSize: 18, fontWeight: 'bold' },
    taskLocation: { color: theme.textSecondary, fontSize: 14, marginTop: 4, marginBottom: 12 },
    separator: { height: 1, backgroundColor: theme.border, marginVertical: 8 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
    detailLabel: { color: theme.textSecondary, fontSize: 15 },
    detailValue: { color: theme.text, fontSize: 15, fontWeight: '600' },
    actionsContainer: { marginTop: 16 },
    actionButton: { paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    actionButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
    startButton: { backgroundColor: '#007AFF' },
    resolveButton: { backgroundColor: '#9b59b6' },
    noActionsText: { color: theme.textSecondary, fontStyle: 'italic', textAlign: 'center', marginTop: 8 },
    emptyText: { color: theme.textSecondary, fontSize: 16, textAlign: 'center' },
});

