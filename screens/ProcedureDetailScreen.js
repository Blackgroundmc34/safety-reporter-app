import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Dummy detailed data for procedures. In a real app, this would come from an API or local database.
const DETAILED_PROCEDURES_DATA = {
  '1': {
    title: 'Lockout/Tagout (LOTO)',
    category: 'Equipment Safety',
    content: `Lockout/Tagout (LOTO) is a safety procedure used to ensure that dangerous machines are properly shut off and not able to be started up again prior to the completion of maintenance or servicing work. It requires isolating energy sources to prevent unexpected startup.

Key Steps:
1. Prepare for shutdown.
2. Notify affected employees.
3. Shut down the machine/equipment.
4. Isolate all energy sources (electrical, hydraulic, pneumatic, mechanical, thermal, etc.).
5. Apply locks and tags to all energy isolation devices.
6. Release stored energy (e.g., capacitors, springs, elevated parts, pressure systems).
7. Verify isolation by attempting to operate the equipment.
8. Perform the maintenance or servicing work.
9. Restore the machine/equipment to normal operation (remove LOTO devices, notify employees, re-energize).`,
    image: 'https://via.placeholder.com/600x300/007AFF/FFFFFF?text=LOTO+Example' // Placeholder image
  },
  '2': {
    title: 'Working at Heights',
    category: 'Personal Safety',
    content: `Working at heights involves any work that could lead to a fall liable to cause personal injury. This includes working on ladders, scaffolding, roofs, or near an opening where a fall could occur.

Key Precautions:
1. Risk assessment: Identify potential fall hazards.
2. Use appropriate fall protection equipment (e.g., harnesses, guardrails, safety nets).
3. Ensure stable and secure working platforms.
4. Inspect equipment before use.
5. Provide adequate training for all workers.
6. Clear working areas of debris.
7. Implement exclusion zones below work areas.`,
    image: 'https://via.placeholder.com/600x300/34C759/FFFFFF?text=Heights+Safety'
  },
  '3': {
    title: 'Confined Space Entry',
    category: 'Area Safety',
    content: `A confined space is an enclosed or partially enclosed space that is not designed for continuous occupancy and has restricted entry/exit. Entry into such spaces requires strict permits and procedures due to potential hazards like hazardous atmospheres, engulfment, or limited entry/exit.

Key Requirements:
1. Permit-to-Work system.
2. Atmospheric testing (oxygen levels, flammable gases, toxic gases) before and during entry.
3. Ventilation.
4. Standby person (attendant) outside the space.
5. Rescue plan and equipment.
6. Proper training for all personnel involved.`,
    image: 'https://via.placeholder.com/600x300/FFD700/000000?text=Confined+Space'
  },
  '4': {
    title: 'Hazardous Material Handling',
    category: 'Environmental',
    content: `Hazardous materials are substances that pose a risk to health, safety, or the environment. Proper handling, storage, and disposal are essential to prevent incidents.

Key Practices:
1. Understand Material Safety Data Sheets (MSDS/SDS).
2. Use appropriate Personal Protective Equipment (PPE).
3. Ensure proper ventilation.
4. Store materials in designated, compatible containers.
5. Label containers clearly.
6. Know emergency procedures for spills and exposures.`,
    image: 'https://via.placeholder.com/600x300/FF6347/FFFFFF?text=HazMat+Handling'
  },
  '5': {
    title: 'Emergency Evacuation Plan',
    category: 'Site Protocol',
    content: `An Emergency Evacuation Plan outlines the procedures to be followed in case of an emergency requiring personnel to leave a building or area. Regular drills ensure preparedness.

Key Elements:
1. Clear evacuation routes and exits.
2. Assembly points.
3. Designated wardens/marshals.
4. Procedures for assisting impaired individuals.
5. Communication methods (alarms, PA systems).
6. Accountability process (roll call).
7. Training and drills.`,
    image: 'https://via.placeholder.com/600x300/00C2B8/FFFFFF?text=Evacuation+Plan'
  },
  '6': {
    title: 'Fire Extinguisher Use',
    category: 'Emergency',
    content: `Knowing how to use a fire extinguisher can save lives and property, but only for small, incipient fires. Always ensure a clear escape route.

Remember the PASS method:
P - Pull the pin.
A - Aim the nozzle at the base of the fire.
S - Squeeze the handle.
S - Sweep the nozzle from side to side.

Important: Only use an extinguisher if the fire is small, contained, you have an escape route, and the correct type of extinguisher for the fire class.`,
    image: 'https://via.placeholder.com/600x300/9C27B0/FFFFFF?text=Fire+Extinguisher'
  },
};

export default function ProcedureDetailScreen({ route }) {
  const { theme } = useTheme(); // Use theme context for styling
  const { procedureId } = route.params; // Get the procedureId passed via navigation
  const [procedure, setProcedure] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data based on procedureId
    setIsLoading(true);
    const data = DETAILED_PROCEDURES_DATA[procedureId];
    if (data) {
      setProcedure(data);
    } else {
      // Handle case where ID is not found (e.g., show an error message)
      Alert.alert("Error", "Procedure details not found.");
    }
    setIsLoading(false);
  }, [procedureId]); // Re-run effect if procedureId changes

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 10 }}>Loading details...</Text>
      </SafeAreaView>
    );
  }

  if (!procedure) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>Procedure not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {procedure.image && (
          <Image source={{ uri: procedure.image }} style={styles.procedureImage} />
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{procedure.title}</Text>
          <Text style={[styles.category, { color: theme.textSecondary }]}>{procedure.category}</Text>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <Text style={[styles.content, { color: theme.text }]}>{procedure.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30, // Add some padding at the bottom for better scroll
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
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
  },
});