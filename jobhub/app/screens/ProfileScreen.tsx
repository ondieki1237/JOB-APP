import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
  AsyncStorage,
  Button,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  Layout 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { List, Avatar, RadioButton } from 'react-native-paper';
import { Modal } from 'react-native';
import { userService } from '../services/userService';

interface ProfileSection {
  id: string;
  title: string;
  icon: string;
  value: string;
  editable: boolean;
}

interface UserProfile {
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  // Add other fields as needed
}

const { width } = Dimensions.get('window');

const currencies = [
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: ['Plumbing', 'Electrical', 'Carpentry'],
    bio: 'Professional handyman with 5+ years of experience in various home improvement projects.',
  });

  const [editableData, setEditableData] = useState({ ...profileData });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('KES');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const savedCurrency = await AsyncStorage.getItem('preferredCurrency');
        if (savedCurrency) {
          setSelectedCurrency(savedCurrency);
        }
      } catch (error) {
        console.error('Error loading currency preference:', error);
      }
    };
    loadCurrency();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserProfile();
      
      if (response.success && response.user) {
        const userData = response.user;
        
        setProfileData({
          name: userData.username || '',
          email: userData.email || '',
          phone: userData.phoneNumber || '',
          location: userData.profile?.location || '',
          skills: userData.profile?.skills || [],
          bio: userData.profile?.bio || '',
        });

        setEditableData({
          name: userData.username || '',
          email: userData.email || '',
          phone: userData.phoneNumber || '',
          location: userData.profile?.location || '',
          skills: userData.profile?.skills || [],
          bio: userData.profile?.bio || '',
        });

        // Set currency if available
        if (userData.profile?.preferredCurrency) {
          setSelectedCurrency(userData.profile.preferredCurrency);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert(
        'Error',
        'Failed to load profile data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updateData = {
        username: editableData.name,
        phoneNumber: editableData.phone,
        profile: {
          bio: editableData.bio,
          location: editableData.location,
          skills: editableData.skills,
          preferredCurrency: selectedCurrency,
        },
      };

      const response = await userService.updateProfile(updateData);
      
      if (response.success) {
        setProfileData(editableData);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSkill = async (index: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // ... skill removal logic
  };

  const handleSignOut = async () => {
    try {
      // Trigger vibration feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Clear all stored data
      await AsyncStorage.clear();
      
      // Navigate to login screen
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleCurrencyChange = async (currency: string) => {
    try {
      await AsyncStorage.setItem('preferredCurrency', currency);
      setSelectedCurrency(currency);
      setShowCurrencyModal(false);
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  const renderProfileImage = () => (
    <View style={styles.profileImageContainer}>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }}
        style={styles.profileImage}
      />
      <TouchableOpacity 
        style={styles.editImageButton}
        onPress={() => Alert.alert('Coming Soon', 'Image upload will be available soon!')}
      >
        <Ionicons name="camera" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  // Create dynamic styles based on theme
  const getInputStyle = (isMultiline = false) => [
    styles.input,
    isDark && styles.darkInput,
    isMultiline && styles.bioInput,
    {
      backgroundColor: isDark ? '#3a3a3a' : '#fff',
      borderColor: isDark ? '#444' : '#e0e0e0',
      color: isDark ? '#fff' : '#000',
    }
  ];

  const getSkillBadgeStyle = () => [
    styles.skillBadge,
    {
      backgroundColor: isDark ? '#4630EB40' : '#4630EB20',
    }
  ];

  const getActionButtonStyle = (isDelete = false) => [
    styles.actionButton,
    {
      backgroundColor: isDelete 
        ? (isDark ? '#3a1515' : '#FFE5E5')
        : (isDark ? '#3a3a3a' : '#fff'),
    }
  ];

  const getSkillTextStyle = () => [
    styles.skillText,
    { color: isDark ? '#fff' : '#4630EB' }
  ];

  const getDeleteButtonStyle = () => [
    styles.deleteButton,
    { backgroundColor: isDark ? '#3a1515' : '#FFE5E5' }
  ];

  const getEditButtonTextStyle = () => [
    styles.editButtonText,
    { color: isDark ? '#4630EB' : '#000' }
  ];

  const renderEditableField = (label: string, value: string, key: keyof typeof editableData) => (
    <View style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, isDark && styles.darkText]}>{label}</Text>
      <TextInput
        style={getInputStyle(key === 'bio')}
        value={editableData[key]}
        onChangeText={(text) => setEditableData({ ...editableData, [key]: text })}
        multiline={key === 'bio'}
        placeholder={`Enter your ${label.toLowerCase()}`}
        placeholderTextColor={isDark ? '#666' : '#999'}
        editable={isEditing}
      />
    </View>
  );

  const renderSkillBadge = (skill: string, index: number) => (
    <Animated.View 
      key={index}
      entering={FadeInRight.delay(index * 100).springify()}
      style={getSkillBadgeStyle()}
    >
      <Text style={getSkillTextStyle()}>
        {skill}
      </Text>
      {isEditing && (
        <TouchableOpacity 
          style={styles.removeSkillButton}
          onPress={() => handleRemoveSkill(index)}
        >
          <Ionicons 
            name="close-circle" 
            size={16} 
            color={isDark ? '#fff' : '#4630EB'} 
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4630EB" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LinearGradient
        colors={isDark ? ['#1a1a1a', '#2d2d2d'] : ['#f5f5f5', '#ffffff']}
        style={styles.gradientBackground}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && styles.darkText]}>Profile</Text>
          <TouchableOpacity 
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isLoading}
            style={[styles.editButton, isLoading && styles.editButtonDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#4630EB" />
            ) : (
              <Text style={getEditButtonTextStyle()}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderProfileImage()}

          <Animated.View 
            entering={FadeInDown.duration(1000).springify()}
            style={styles.profileContainer}
          >
            <Animated.View entering={FadeInDown.delay(200).springify()}>
              {renderEditableField('Name', profileData.name, 'name')}
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              {renderEditableField('Email', profileData.email, 'email')}
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              {renderEditableField('Phone', profileData.phone, 'phone')}
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(500).springify()}>
              {renderEditableField('Location', profileData.location, 'location')}
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600).springify()}>
              {renderEditableField('Bio', profileData.bio, 'bio')}
            </Animated.View>

            {/* Skills Section */}
            <Animated.View 
              style={styles.skillsGrid}
              layout={Layout.springify()}
            >
              {profileData.skills.map((skill, index) => renderSkillBadge(skill, index))}
            </Animated.View>

            {/* Account Actions */}
            <View style={styles.accountActions}>
              <TouchableOpacity style={getActionButtonStyle()}>
                <MaterialCommunityIcons name="shield-lock" size={24} color="#4630EB" />
                <Text style={styles.actionButtonText}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[getActionButtonStyle(true), getDeleteButtonStyle()]}>
                <MaterialCommunityIcons name="delete" size={24} color="#FF4444" />
                <Text style={[styles.actionButtonText, { color: '#FF4444' }]}>
                  Delete Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.signOutButton]}
                onPress={handleSignOut}
              >
                <Ionicons name="log-out-outline" size={24} color="#FF4444" />
                <Text style={[styles.actionButtonText, styles.signOutText]}>
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>

            <List.Section>
              <List.Subheader>Preferences</List.Subheader>
              <List.Item
                title="Currency"
                description={`${currencies.find(c => c.code === selectedCurrency)?.name} (${currencies.find(c => c.code === selectedCurrency)?.symbol})`}
                left={props => <List.Icon {...props} icon="currency-usd" />}
                onPress={() => setShowCurrencyModal(true)}
              />
            </List.Section>
          </Animated.View>
        </ScrollView>
      </LinearGradient>

      {/* Currency Selection Modal */}
      <Modal
        visible={showCurrencyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <RadioButton.Group 
              onValueChange={handleCurrencyChange} 
              value={selectedCurrency}
            >
              {currencies.map((currency) => (
                <RadioButton.Item
                  key={currency.code}
                  label={`${currency.name} (${currency.symbol})`}
                  value={currency.code}
                  style={styles.radioItem}
                />
              ))}
            </RadioButton.Group>
            <Button
              mode="contained"
              onPress={() => setShowCurrencyModal(false)}
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
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  editButton: {
    color: '#4630EB',
    fontSize: 16,
    fontWeight: '600',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#4630EB',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileContainer: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  darkInput: {
    backgroundColor: '#2a2a2a',
    borderColor: '#333',
    color: '#fff',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  skillsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addSkillButton: {
    borderWidth: 1,
    borderColor: '#4630EB',
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountActions: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  signOutButton: {
    backgroundColor: '#FFF5F5',
  },
  actionButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  signOutText: {
    color: '#FF4444',
  },
  deleteButton: {
    marginTop: 12,
  },
  editButtonDisabled: {
    backgroundColor: '#ccc',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  radioItem: {
    paddingVertical: 8,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#4630EB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
}); 