import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, ActivityIndicator, Image, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const DETAILED_PROCEDURES_DATA = {
  '1': {
    title: 'Lockout/Tagout (LOTO)',
    category: 'Equipment Safety',
    content: `Lockout/Tagout (LOTO) is a safety procedure used to ensure that dangerous machines are properly shut off and not able to be started up again prior to the completion of maintenance or servicing work. It requires isolating energy sources to prevent unexpected startup.

Key Steps:
1. Prepare for shutdown.
2. Notify affected employees.
3. Shut down the machine/equipment.
4. Isolate all energy sources (electrical, hydraulic, pneumatic, etc.).
5. Apply locks and tags to all energy isolation devices.
6. Release stored energy (e.g., capacitors, springs).
7. Verify isolation by attempting to operate the equipment.`,
    image: 'https://placehold.co/600x300/007AFF/FFFFFF?text=LOTO+Example'
  },
  '2': {
    title: 'Working at Heights',
    category: 'Personal Safety',
    content: `Working at heights involves any work that could lead to a fall liable to cause personal injury.

Key Precautions:
1. Risk assessment: Identify potential fall hazards.
2. Use appropriate fall protection equipment (e.g., harnesses, guardrails).
3. Ensure stable and secure working platforms.
4. Inspect equipment before use.
5. Provide adequate training for all workers.`,
    image: 'https://placehold.co/600x300/34C759/FFFFFF?text=Heights+Safety'
  },
};

export default function ProcedureDetailScreen({ route }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { procedureId } = route.params;
  const [procedure, setProcedure] = useState(null);

  useEffect(() => {
    const data = DETAILED_PROCEDURES_DATA[procedureId];
    if (data) {
      setProcedure(data);
    } else {
      Alert.alert("Error", "Procedure details not found.");
    }
  }, [procedureId]);

  if (!procedure) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {procedure.image && (
          <Image source={{ uri: procedure.image }} style={styles.procedureImage} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{procedure.title}</Text>
          <Text style={styles.category}>{procedure.category}</Text>
          <View style={styles.divider} />
          <Text style={styles.content}>{procedure.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  procedureImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.text,
  },
});
