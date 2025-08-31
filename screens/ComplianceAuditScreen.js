import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SAFETY_AUDIT_QUESTIONS = [
  { id: 'saf-1', text: 'Are emergency exits clear and unobstructed?' },
  { id: 'saf-2', text: 'Are all workers wearing appropriate PPE?' },
  { id: 'saf-3', text: 'Are machine guards in place and functional?' },
  { id: 'saf-4', text: 'Are fire extinguishers accessible and inspected?' },
  { id: 'saf-5', text: 'Is first-aid equipment readily available?' },
];

export default function ComplianceAuditScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [auditState, setAuditState] = useState('start'); // 'start', 'in_progress', 'complete'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const startAudit = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setAuditState('in_progress');
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, { question: SAFETY_AUDIT_QUESTIONS[currentQuestionIndex].text, answer }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < SAFETY_AUDIT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setAuditState('complete');
    }
  };
  
  const resetAudit = () => {
      setAuditState('start');
  }

  const renderStartScreen = () => (
    <View style={styles.contentContainer}>
      <MaterialCommunityIcons name="clipboard-check-outline" size={60} color={theme.primary} />
      <Text style={styles.title}>Compliance Audit</Text>
      <Text style={styles.description}>Select an audit type to begin the inspection process.</Text>
      <TouchableOpacity style={styles.button} onPress={startAudit}>
        <Text style={styles.buttonText}>Start Safety Audit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInProgressScreen = () => {
    const question = SAFETY_AUDIT_QUESTIONS[currentQuestionIndex];
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.progressText}>Question {currentQuestionIndex + 1} of {SAFETY_AUDIT_QUESTIONS.length}</Text>
        <Text style={styles.questionText}>{question.text}</Text>
        <View style={styles.answerButtonsContainer}>
          <TouchableOpacity style={[styles.answerButton, styles.yesButton]} onPress={() => handleAnswer('Yes')}>
            <MaterialCommunityIcons name="check-circle-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.answerButton, styles.noButton]} onPress={() => handleAnswer('No')}>
            <MaterialCommunityIcons name="close-circle-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCompleteScreen = () => (
    <View style={styles.contentContainer}>
        <MaterialCommunityIcons name="check-decagram" size={60} color="#34C759" />
        <Text style={styles.title}>Audit Complete</Text>
        <Text style={styles.description}>The audit results have been successfully logged.</Text>
        <TouchableOpacity style={styles.button} onPress={resetAudit}>
            <Text style={styles.buttonText}>Start New Audit</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {auditState === 'start' && renderStartScreen()}
      {auditState === 'in_progress' && renderInProgressScreen()}
      {auditState === 'complete' && renderCompleteScreen()}
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    padding: 30,
  },
  title: {
    color: theme.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  description: {
    color: theme.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8
  },
  progressText: {
      color: theme.textSecondary,
      fontSize: 16,
      marginBottom: 20,
  },
  questionText: {
      color: theme.text,
      fontSize: 22,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 40,
      lineHeight: 30,
  },
  answerButtonsContainer: {
      width: '100%',
  },
  answerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      borderRadius: 12,
      marginBottom: 15,
  },
  yesButton: {
      backgroundColor: '#34C759',
  },
  noButton: {
      backgroundColor: '#FF6347',
  },
});
