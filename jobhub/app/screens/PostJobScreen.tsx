import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { jobService } from '../services/jobService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const jobTypes = ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Fixed'];

export default function PostJobScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: [] as string[],
    locationName: '',
    budget: {
      min: '',
      max: '',
    },
    duration: jobTypes[0],
    companyDetails: {
      name: '',
      description: '',
    },
    requirements: {
      experience: '',
      education: '',
      certifications: [] as string[],
    },
    isRemote: false,
    numberOfOpenings: '1',
    contactInfo: {
      email: '',
      phone: '',
    },
    deadline: new Date(),
  });

  const [skillInput, setSkillInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(s => s !== skill),
    });
  };

  const addCertification = () => {
    if (certificationInput.trim() && !formData.requirements.certifications.includes(certificationInput.trim())) {
      setFormData({
        ...formData,
        requirements: {
          ...formData.requirements,
          certifications: [...formData.requirements.certifications, certificationInput.trim()],
        },
      });
      setCertificationInput('');
    }
  };

  const removeCertification = (cert: string) => {
    setFormData({
      ...formData,
      requirements: {
        ...formData.requirements,
        certifications: formData.requirements.certifications.filter(c => c !== cert),
      },
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        deadline: selectedDate
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.description || !formData.locationName || 
          !formData.budget.min || !formData.budget.max || !formData.companyDetails.name) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      setLoading(true);

      const jobData = {
        ...formData,
        budget: {
          min: Number(formData.budget.min),
          max: Number(formData.budget.max),
        },
        numberOfOpenings: Number(formData.numberOfOpenings),
        status: 'Open',
        applicationDetails: {
          deadline: formData.deadline,
          howToApply: 'Apply through the platform'
        }
      };

      const response = await jobService.createJob(jobData);
      setShowSuccessModal(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Posting job..." />;
  }

  const employeeCountSection = (
    <View style={styles.section}>
      <Text variant="labelLarge" style={styles.sectionTitle}>
        Number of Employees Required *
        <Text style={styles.helperText}> (How many positions to fill)</Text>
      </Text>
      <TextInput
        mode="outlined"
        keyboardType="numeric"
        value={formData.numberOfOpenings}
        onChangeText={(text) => {
          const number = text.replace(/[^0-9]/g, '');
          setFormData(prev => ({
            ...prev,
            numberOfOpenings: number || '1'
          }));
        }}
        style={styles.input}
        placeholder="Enter number of positions"
        right={<TextInput.Icon icon="account-multiple" />}
      />
    </View>
  );

  const deadlineSection = (
    <View style={styles.section}>
      <Text variant="labelLarge" style={styles.sectionTitle}>
        Application Deadline *
        <Text style={styles.helperText}> (Select when the job posting should expire)</Text>
      </Text>
      <View style={styles.deadlineContainer}>
        <Button
          mode="outlined"
          icon="calendar"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
          contentStyle={styles.dateButtonContent}
        >
          {formData.deadline.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Button>
        
        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            value={formData.deadline}
            mode="date"
            display="calendar"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
        
        {Platform.OS === 'ios' && (
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.datePickerContainer}>
                <Text style={styles.datePickerTitle}>Select Deadline</Text>
                <DateTimePicker
                  value={formData.deadline}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
                <View style={styles.datePickerButtons}>
                  <Button 
                    mode="outlined"
                    onPress={() => setShowDatePicker(false)}
                    style={[styles.datePickerButton, styles.cancelButton]}
                  >
                    Cancel
                  </Button>
                  <Button 
                    mode="contained"
                    onPress={() => setShowDatePicker(false)}
                    style={styles.datePickerButton}
                  >
                    Confirm
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4630EB', '#5E47F2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color="#fff"
            onPress={() => router.push('/(app)/home')}
          />
          <Text style={styles.headerTitle}>Post a Job</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <TextInput
              label="Job Title *"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Job Description *"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.skillsSection}>
              <Text style={styles.sectionTitle}>Required Skills</Text>
              <View style={styles.skillInputContainer}>
                <TextInput
                  label="Add Skill"
                  value={skillInput}
                  onChangeText={setSkillInput}
                  mode="outlined"
                  style={[styles.input, { flex: 1 }]}
                  right={
                    <TextInput.Icon 
                      icon="plus" 
                      onPress={addSkill}
                    />
                  }
                />
              </View>
              <View style={styles.chipContainer}>
                {formData.skillsRequired.map((skill, index) => (
                  <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{skill}</Text>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color="#666"
                      onPress={() => removeSkill(skill)}
                    />
                  </View>
                ))}
              </View>
            </View>

            <TextInput
              label="Location *"
              value={formData.locationName}
              onChangeText={(text) => setFormData({ ...formData, locationName: text })}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.budgetContainer}>
              <TextInput
                label="Min Budget *"
                value={formData.budget.min}
                onChangeText={(text) => setFormData({
                  ...formData,
                  budget: { ...formData.budget, min: text }
                })}
                keyboardType="numeric"
                mode="outlined"
                style={[styles.input, { flex: 1 }]}
              />
              <TextInput
                label="Max Budget *"
                value={formData.budget.max}
                onChangeText={(text) => setFormData({
                  ...formData,
                  budget: { ...formData.budget, max: text }
                })}
                keyboardType="numeric"
                mode="outlined"
                style={[styles.input, { flex: 1 }]}
              />
            </View>

            <Text style={styles.sectionTitle}>Duration</Text>
            <SegmentedButtons
              value={formData.duration}
              onValueChange={value => setFormData({ ...formData, duration: value })}
              buttons={jobTypes.map(type => ({
                value: type,
                label: type,
              }))}
              style={styles.segmentedButton}
            />

            <TextInput
              label="Company Name *"
              value={formData.companyDetails.name}
              onChangeText={(text) => setFormData({
                ...formData,
                companyDetails: { ...formData.companyDetails, name: text }
              })}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Company Description"
              value={formData.companyDetails.description}
              onChangeText={(text) => setFormData({
                ...formData,
                companyDetails: { ...formData.companyDetails, description: text }
              })}
              multiline
              numberOfLines={3}
              mode="outlined"
              style={styles.input}
            />

            {employeeCountSection}
            {deadlineSection}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              labelStyle={styles.submitButtonText}
            >
              Post Job
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowSuccessModal(false);
          router.push('/(app)/home');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons 
              name="emoticon-happy-outline" 
              size={64} 
              color="#4630EB" 
            />
            <Text style={styles.modalTitle}>Thank You!</Text>
            <Text style={styles.modalText}>
              Thank you for trusting us to do your errands 😊
            </Text>
            <Button
              mode="contained"
              onPress={() => {
                setShowSuccessModal(false);
                router.push('/(app)/home');
              }}
              style={styles.closeButton}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  skillInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  budgetContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  segmentedButton: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
    backgroundColor: '#4630EB',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  skillsSection: {
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    maxWidth: 340,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  closeButton: {
    width: '100%',
    backgroundColor: '#4630EB',
  },
  deadlineContainer: {
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  dateButton: {
    marginVertical: 8,
    borderColor: '#4630EB',
    width: '100%',
  },
  dateButtonContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  datePickerButton: {
    flex: 1,
  },
  cancelButton: {
    borderColor: '#4630EB',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'normal',
  },
}); 