import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { jobService } from '../services/jobService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import JobCard from '../components/JobCard';
import { FlashList } from '@shopify/flash-list';

interface Job {
  _id: string;
  title: string;
  description: string;
  companyDetails: {
    name: string;
  };
  budget: {
    min: number;
    max: number;
  };
  locationName: string;
  duration: string;
  status: string;
}

export default function JobListScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setError(null);
      const response = await jobService.getJobs({
        search: searchQuery,
        status: ['Open']
      });
      setJobs(response.jobs);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please try again.');
      Alert.alert('Error', error.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery]);

  const renderJobCard = ({ item }: { item: Job }) => (
    <JobCard
      _id={item._id}
      title={item.title}
      company={item.companyDetails.name}
      location={item.locationName}
      budget={`$${item.budget.min} - $${item.budget.max}`}
      duration={item.duration}
      status={item.status}
    />
  );

  if (loading) {
    return <LoadingSpinner message="Loading jobs..." />;
  }

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
          <Text style={styles.headerTitle}>Available Jobs</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Searchbar
          placeholder="Search jobs..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : jobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No jobs found</Text>
          </View>
        ) : (
          <FlashList
            data={jobs}
            renderItem={renderJobCard}
            estimatedItemSize={200}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

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
  searchbar: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  listContainer: {
    padding: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 