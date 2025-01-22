import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface JobCardProps {
  _id: string;
  title: string;
  company: string;
  location: string;
  budget: string;
  duration: string;
  status: string;
}

export default function JobCard({ 
  title, 
  company, 
  location, 
  budget, 
  duration,
  status,
  _id 
}: JobCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      onPress={() => router.push(`/jobs/${_id}`)}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: status === 'Open' ? '#4CAF50' : '#FFA000' }
        ]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <Text style={styles.company}>{company}</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detail}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{location}</Text>
        </View>

        <View style={styles.detail}>
          <MaterialCommunityIcons name="currency-usd" size={16} color="#666" />
          <Text style={styles.detailText}>{budget}</Text>
        </View>

        <View style={styles.detail}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
}); 