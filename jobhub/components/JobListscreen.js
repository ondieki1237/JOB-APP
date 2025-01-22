// screens/JobListScreen.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { jobService } from '../app/services/jobService';
import JobCard from '../components/JobCard';

export default function JobListScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobs();
      setJobs(response.jobs);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4630EB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (jobs.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noJobsText}>No jobs found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <JobCard
            title={item.title}
            company={item.companyDetails.name}
            location={item.locationName}
            budget={`$${item.budget.min} - $${item.budget.max}`}
            duration={item.duration}
            status={item.status}
          />
        )}
        refreshing={loading}
        onRefresh={fetchJobs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  noJobsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
