import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card, Chip, Divider } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { jobService } from '../services/jobService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';

interface JobDetails {
  _id: string;
  title: string;
  description: string;
  companyDetails?: {
    name: string;
    description: string;
  };
  budget: {
    min: number;
    max: number;
  };
  locationName: string;
  duration: string;
  status: 'Open' | 'Closed' | 'In Progress';
  requirements?: string[];
  responsibilities?: string[];
  createdAt: string;
  isRemote: boolean;
  numberOfOpenings: number;
  applicationDetails?: {
    deadline: string;
  };
  skillsRequired?: string[];
  requirements?: {
    experience: string;
    education: string;
    certifications?: string[];
  };
  companyDetails?: {
    name: string;
    description: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

export default function JobDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) {
        setError('No job ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await jobService.getJobById(id as string);
        if (response && response.job) {
          setJob(response.job);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading job details..." />;
  }

  if (error || !job) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#4630EB', '#5E47F2']} style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color="#fff"
              onPress={() => router.back()}
            />
            <Text style={styles.headerTitle}>Error</Text>
          </View>
        </LinearGradient>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Failed to load job details'}</Text>
          <Button mode="contained" onPress={() => router.back()} style={styles.errorButton}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const handleMessage = () => {
    router.push({
      pathname: `/messages/${job._id}`,
      params: {
        jobTitle: job.title,
        companyName: job.companyDetails?.name || 'Company'
      }
    });
  };

  const handleApply = () => {
    // Implement apply functionality
    Alert.alert('Apply', 'Application functionality coming soon!');
  };

  const renderDetailItem = (icon: string, label: string, value: string | number) => (
    <View style={styles.detailItem}>
      <MaterialCommunityIcons name={icon} size={24} color="#4630EB" />
      <View style={styles.detailText}>
        <Text variant="labelMedium" style={styles.detailLabel}>{label}</Text>
        <Text variant="bodyMedium">{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4630EB', '#5E47F2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color="#fff"
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Job Details</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.duration(500)}
          style={styles.mainCard}
        >
          <Text style={styles.title}>{job.title}</Text>
          {job.companyDetails && (
            <View style={styles.companyRow}>
              <MaterialCommunityIcons name="office-building" size={20} color="#666" />
              <Text style={styles.company}>{job.companyDetails.name}</Text>
            </View>
          )}
          <Chip 
            mode="flat"
            style={[
              styles.statusChip,
              { backgroundColor: job.status === 'Open' ? '#E7F7E8' : '#FFE5E5' }
            ]}
            textStyle={{
              color: job.status === 'Open' ? '#1F9D55' : '#DC3545',
              fontWeight: '600',
            }}
          >
            {job.status}
          </Chip>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.duration(500).delay(100)}
          style={styles.detailsCard}
        >
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={24} color="#4630EB" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailText}>{job.locationName}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#4630EB" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailText}>{job.duration}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="currency-usd" size={24} color="#4630EB" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Budget</Text>
              <Text style={styles.detailText}>${formatCurrency(job.budget.min)} - ${formatCurrency(job.budget.max)}</Text>
            </View>
          </View>
        </Animated.View>

        <Card style={[styles.section, styles.elevatedCard]}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{job.description}</Text>
          </Card.Content>
        </Card>

        {job.requirements && job.requirements.length > 0 && (
          <Card style={[styles.section, styles.elevatedCard]}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Requirements</Text>
              {job.requirements.map((req, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#4630EB" />
                  <Text style={styles.bulletText}>{req}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {job.responsibilities && job.responsibilities.length > 0 && (
          <Card style={[styles.section, styles.elevatedCard]}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Responsibilities</Text>
              {job.responsibilities.map((resp, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <MaterialCommunityIcons name="arrow-right-circle" size={20} color="#4630EB" />
                  <Text style={styles.bulletText}>{resp}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        <Card style={[styles.section, styles.elevatedCard]}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Application Details</Text>
            {renderDetailItem('account-multiple', 'Positions Available', 
              `${job.numberOfOpenings} ${job.numberOfOpenings > 1 ? 'positions' : 'position'}`
            )}
            {renderDetailItem('calendar-clock', 'Application Deadline', 
              formatDate(job.applicationDetails?.deadline)
            )}
          </Card.Content>
        </Card>

        <Card style={[styles.section, styles.elevatedCard]}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Company Details</Text>
            <Text style={styles.description}>{job.companyDetails?.description || 'No company description available'}</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.section, styles.elevatedCard]}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            {job.contactInfo?.email && renderDetailItem('email', 'Email', job.contactInfo.email)}
            {job.contactInfo?.phone && renderDetailItem('phone', 'Phone', job.contactInfo.phone)}
          </Card.Content>
        </Card>
      </ScrollView>

      <Animated.View 
        entering={FadeInDown.duration(500).delay(200)}
        style={styles.footer}
      >
        <Button
          mode="outlined"
          style={styles.messageButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress={handleMessage}
        >
          Message
        </Button>
        <Button
          mode="contained"
          style={styles.applyButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          disabled={job.status !== 'Open'}
          onPress={handleApply}
        >
          Apply Now
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 30,
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
  content: {
    flex: 1,
    padding: 16,
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  company: {
    fontSize: 18,
    color: '#666',
  },
  statusChip: {
    alignSelf: 'flex-start',
    borderRadius: 20,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  section: {
    marginBottom: 16,
  },
  elevatedCard: {
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  messageButton: {
    flex: 1,
    borderColor: '#4630EB',
    borderWidth: 2,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#4630EB',
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#4630EB',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    color: '#666',
  },
}); 