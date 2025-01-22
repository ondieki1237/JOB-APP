import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { jobService } from '../services/jobService';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Job {
  _id: string;
  title: string;
  companyDetails: {
    name: string;
  };
  locationName: string;
  status: string;
}

export default function ActiveJobsScreen() {
  const router = useRouter();
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActiveJobs = async () => {
    try {
      // Fetch only jobs with 'Open' or 'In Progress' status
      const response = await jobService.getJobs({ 
        status: ['Open', 'In Progress'],
        limit: 10 // Limit to 10 most recent jobs
      });
      setActiveJobs(response.jobs);
    } catch (error: any) {
      console.error('Error fetching active jobs:', error);
      Alert.alert('Error', 'Failed to fetch active jobs');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActiveJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchActiveJobs();
  }, []);

  if (loading) {
    return <LoadingSpinner type="work" message="Loading active jobs..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4630EB', '#5E47F2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Active Jobs</Text>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.push('/(app)/home')}
          >
            <Ionicons name="home-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeJobs.length === 0 ? (
          <Text style={styles.noJobsText}>No active jobs found</Text>
        ) : (
          activeJobs.map((job, index) => (
            <Animated.View
              key={job._id}
              entering={FadeInDown.delay(index * 100).springify()}
              style={styles.jobCard}
            >
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{job.status}</Text>
                </View>
              </View>

              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{job.companyDetails.name}</Text>
                <View style={styles.locationContainer}>
                  <MaterialCommunityIcons name="map-marker-outline" size={16} color="#666" />
                  <Text style={styles.locationText}>{job.locationName}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.viewButton}
                onPress={() => router.push(`/job/${job._id}`)}
              >
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 8,
  },
  homeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  companyInfo: {
    marginBottom: 16,
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  viewButton: {
    backgroundColor: '#4630EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noJobsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
}); 